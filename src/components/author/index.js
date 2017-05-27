/**
 * Created by Linfe on 2017/5/26.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import List from './List'
import Edit from './Edit'

function Author(props) {
    const { url } = props.match

    return (
        <Switch>
            {/* 新增作者，不需要fetch data */}
            <Route path={`${url}/new`} component={Edit} />
            {/* 编辑作者，使用fetch获取数据 */}
            <Route
                path={`${url}/edit/:id`}
                render={
                    ({ history, match }) => <Edit history={history} fetch={{ url: `/api/author/${match.params.id}` }} />
                }
            />
            {/* 列表，因为加入了分页，数据处理放到了List里面 */}
            <Route path={`${url}`} component={List} />
        </Switch>
    )
}

Author.propTypes = {
    match: PropTypes.object.isRequired,
}

export default Author
