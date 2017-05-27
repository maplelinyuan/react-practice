/**
 * Created by Linfe on 2017/5/26.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import refetch from 'refetch'
import { Mask, Spin } from 'rctui'

const PENDING = 0
const SUCCESS = 1
const FAILURE = 2

export default function (Origin) {
    class Fetch extends Component {
        constructor(props){
            super(props)
            this.state = {
                data: null,
                status: props.fetch ? PENDING : SUCCESS
            }
            this.fetchData = this.fetchData.bind(this)
        }
        componentWillMount() {
            if(this.props.fetch) this.fetchData()
        }
        componentWillUnmount() {
            this.isUnmounted = true
        }
        fetchData(){
            let { fetch } = this.props;
            if(typeof fetch === 'string') fetch = { url: fetch}

            // 设置状态为加载中
            this.setState({ data: null, status: PENDING})
            refetch.get(fetch.url, fetch.data).then((res) => {
                // 如果组件
                if (this.isUnmounted) return

                // demo数据格式统一为，成功返回data, 失败返回error
                if(res.data) {
                    this.setState({ status: SUCCESS, data: res.data })
                } else {
                    this.setState({ status: FAILURE, message: res.error})
                }
            }).catch((e) => {
                if(this.isUnmounted) return
                this.setState({ status: FAILURE, message: e.message})
            })
        }
        render(){
            const { status, data } = this.state

            // 状态为成功返回组件，并且传入data
            if(status == SUCCESS){
                return <Origin {...this.props} data={data} fetchData={this.fetcgData} />
            }

            // 加载中，返回一个动态的加载中
            if(status === PENDING){
                return (
                    <div style={{ position: 'relative' }}>
                        <Mask >
                            <Spin size={40} type="simple-circle" />
                        </Mask>
                    </div>
                )
            }
            // 处理失败信息
            if(status === FAILURE){
                return <div>{this.state.message}</div>
            }
            return null
        }
    }

    Fetch.propTypes = {
        fetch: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ])
    }
    Fetch.defaultProps = {
        fetch: null
    }

    return Fetch
};