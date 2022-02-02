import React, {useState, useEffect} from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import {useSelector, useDispatch} from "react-redux"
import {Table, Button} from "react-bootstrap"
import Loader from '../components/Loader'
import Message from '../components/Message'
import { deleteUser, listUsers } from '../actions/userActions'


const UserListScreen = ({history}) => {

    const dispatch = useDispatch()

    const userList = useSelector(state => state.userList)
    const {users, loading, error} = userList

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    const userDelete = useSelector(state => state.userDelete)
    const {loading: loadingDelete, success: successDelete} = userDelete

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listUsers())
        }
        else {
            history.push("/login")
        }
    }, [dispatch, history, successDelete, userInfo])

    const deleteHandler = id => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            dispatch(deleteUser(id))
        }   
    }

    return (
        <div>
            <h1>Users</h1>
            {loading ? <Loader/> : error ? <Message variant="danger">{error}</Message> : (
                <Table striped responsive bordered hover className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? (
                                    <i className="fas fa-check" style={{color: "green"}}></i>
                                ) : (
                                    <i className="fas fa-times" style={{color: "red"}}></i>
                                )}</td>
                                <td>
                                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                        <Button variant="light" className="btn btn-sm">
                                            <i className="fas fa-edit"></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant="danger" className="btn btn-sm" onClick={() => deleteHandler(user._id)}>
                                            <i className="fas fa-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    )
}

export default UserListScreen
