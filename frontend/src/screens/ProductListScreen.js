import React, {useState, useEffect} from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import {useSelector, useDispatch} from "react-redux"
import {Table, Button, Row, Col} from "react-bootstrap"
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import { listProducts, deleteProduct, createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'


const ProductListScreen = ({history, match}) => {

    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList)
    const {products, loading, error, pages, page} = productList

    const productDelete = useSelector(state => state.productDelete)
    const {success: successDelete, error: errorDelete, loading: loadingDelete} = productDelete

    const productCreate = useSelector(state => state.productCreate)
    const {success: successCreate, error: errorCreate, loading: loadingCreate, product: createdProduct} = productCreate

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    let keyword = history.location.search

    useEffect(() => {
        dispatch({
            type: PRODUCT_CREATE_RESET
        })
        if (!userInfo.isAdmin) {
            history.push("/login")
        }
        if (successCreate) {
            history.push(`/admin/product/${createdProduct._id}/edit`)
        }
        else {
            dispatch(listProducts(keyword))
        }
    }, [dispatch, history, userInfo, successDelete, successCreate, createdProduct, keyword])

    const deleteHandler = id => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(deleteProduct(id))
        }   
    }

    const createProductHandler = () => {
        dispatch(createProduct())
    }

    return (
        <div>
            <Row className="align-items-center">
                <Col md={10}>
                    <h1>Products</h1>
                </Col>
                <Col md={2} className="text-right">
                    <Button className="my-3" onClick={createProductHandler}>
                        <i className="fas fa-plus"></i> Create Product
                    </Button>
                </Col>
            </Row>
            {loadingDelete && <Loader/>}
            {errorDelete && <Message variant="danger">{errorDelete}</Message>}
            {loadingCreate && <Loader/>}
            {errorCreate && <Message variant="danger">{errorCreate}</Message>}
            {loading ? <Loader/> : error ? <Message variant="danger">{error}</Message> : (
                <div>
                    <Table striped responsive bordered hover className="table-sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                            <Button variant="light" className="btn btn-sm">
                                                <i className="fas fa-edit"></i>
                                            </Button>
                                        </LinkContainer>
                                        <Button variant="danger" className="btn btn-sm" onClick={() => deleteHandler(product._id)}>
                                                <i className="fas fa-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginate pages={pages} page={page} isAdmin={true}/>
                </div>
            )}
        </div>
    )
}

export default ProductListScreen
