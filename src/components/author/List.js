/**
 * Created by Linfe on 2017/5/26.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Card, Button } from 'rctui'
import queryString from 'query-string'
import TableList from './TableList'

function List(props) {
    const { history } = props

    // 从queryString中获取分页信息，格式为 ?page=x&size=x
    const query = queryString.parse(history.location.search)
    // 每页数据数量
    if (!query.size) query.size = 10

    return (
        <Card>
            <Card.Header>作者列表</Card.Header>
            <div style={{ padding: 12 }}>
                <Button status="success" onClick={() => history.push('/author/new')}>添加作者</Button>
            </div>

            <TableList
                history={history}
                fetch={{ url: '/api/authorlist', data: query }}
            />
        </Card>
    )
}

List.propTypes = {
    history: PropTypes.object.isRequired,
}

export default List