import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Row, Col, Divider, Spin, Empty } from 'antd';
import axios from 'axios';

import './Products.css';

import ListingHeader from './ListingHeader';
import Filters from './filters/Filters';
import ProductCard from './ProductCard';
import ProductPagination from './ProductPagination';

const querySearch = require("stringquery");


class Products extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            current: 1,
            isLoading: true,
            min: 30,
            max: 200,
            category: undefined,
            gender: "todos",
            order: undefined
        }

        this.handlePagination = this.handlePagination.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.handlePrice = this.handlePrice.bind(this);
        this.handleGender = this.handleGender.bind(this);
        this.handeCategory = this.handeCategory.bind(this);
        this.handleOrder = this.handleOrder.bind(this);
        this.orderedData = this.orderedData.bind(this);
        
    }
    
    componentDidMount() {

        const search = querySearch(this.props.location.search);
       
        
        if (this.props.match.params.gender !== undefined) {
            this.setState({ gender: this.props.match.params.gender })
        }
        if (this.props.match.params.category !== undefined) {
            this.setState({ category: this.props.match.params.category })
        }

        setTimeout(() => {
            this.getProducts({ page: search.page !== undefined ? search.page : 1 });
        }, 1500)
    }

    getProducts(data={}) {

        axios.get('/products', {
            params: {
                limit: 8,
                page: data.page || 1,
                gender: this.state.gender,
                category: this.state.category,
                min: this.state.min,
                max: this.state.max,
                pathname: undefined

            }
        }).then((result) => {
            if(Object.keys(result.data).length === 0) {
                result.data = [];
            }
 
            this.setState({ data: result.data, isLoading: false, current: result.data.page });
        });
    }

    handlePagination(page) {
        this.setState({ isLoading: true }, () => {

            
            let gender = this.props.match.params.gender || '';
            let category = (this.state.category !== undefined) ?  '/' + this.state.category : '';
            let url = '/produtos/' + gender + category + '?page=' + page;
            window.history.pushState('', '', [url]);
            
            
            this.getProducts({page: page});
        });
    }

    handlePrice(value) {
        this.setState({ min: value[0], max: value[1], isLoading: true },() => {
            this.getProducts();
        });
    }

    handleGender(gender) {
        
        this.setState({ gender: gender }, () => {
            this.props.match.params.gender = gender;
            let category = (this.state.category !== undefined) ?  '/' + this.state.category : '';
            let url = '/produtos/' + gender + category;
            window.history.pushState('', '', [url])
            this.getProducts();

            this.setState({ pathname: url });
        })
    }

    handeCategory(category) {
        let url;

        if (this.state.gender !== "todos") {
            url = '/produtos/' + this.state.gender + '/' + category.name.toLowerCase();
        } else {
            url = '/produtos/' + category.gender.toLowerCase() + '/' + category.name.toLowerCase()
        }

        window.history.pushState('', '', [url])
        
        this.setState({ isLoading: true, category: category.name.toLowerCase(), pathname: url }, () => {
            this.getProducts();
        })

    }

    handleOrder(order) {
        this.setState({ order: order.key });
        
    }

    orderedData() {
        var docs = this.state.data.docs.slice();

        if (parseInt(this.state.order) === 0) {
            return docs.sort((a, b) => {
                return (a.price < b.price) ? -1 : (a.price > b.price) ? 1 : 0;
            });
        }
        else if (parseInt(this.state.order) === 1) {
            return docs.sort((a, b) => {
                return (a.price < b.price) ? 1 : (a.price > b.price) ? -1 : 0;
            });
        }
        else if (parseInt(this.state.order) === 2) {
            return docs.sort((a, b) => {
                return (a.offers && !b.offers) ? -1 : (!a.offers && b.offers) ? 1 : 0;
            });
        }
        
        else return this.state.data.docs;
        
        
    }

    render() {
        
        return (
            <div className="page">
                <div className="container">
                    <div className="products">
                        <ListingHeader 
                            data={this.state.data} 
                            location={this.props.location}
                            pathname={this.state.pathname}
                            match={this.props.match}
                            onOrderChange={this.handleOrder}
                            onPriceChange={this.handlePrice}
                            onGenderChange={this.handleGender}
                            onCategoryChange={this.handeCategory} />
                    </div>
                    <div className="content">
                        <Row gutter={12} justify="center">
                            <Divider />
                            <Col lg={4} className="desktop">
                                <h3 style={{ 
                                    textTransform: 'uppercase',
                                    fontWeight: 'bold'
                                    }}
                                >Filtros de busca</h3>

                                <Filters 
                                    match={this.props.match}
                                    closeDrawer={() => {}}
                                    onGenderChange={this.handleGender}
                                    onPriceChange={this.handlePrice} 
                                    onCategoryChange={this.handeCategory} />
                            </Col>
                            <Col lg={20} md={24}>
                                <Row gutter={12}>
                                    {this.getContent()}
                                </Row>
                                <ProductPagination
                                    current={this.state.current}
                                    isLoading={this.state.isLoading}
                                    data={this.state.data}
                                    handlePagination={this.handlePagination}
                                />
                            </Col>                   
                        </Row>
                    </div>
                </div>
            </div>
        );
    }

    getContent() {
        if(this.state.isLoading) {
            return(
                <div className="loading">
                    <Spin size="large" />
                </div>
            );
        } else {

            if(Object.keys(this.state.data.docs).length === 0) {
                return(
                    
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />

                );
            }
            return(
                this.orderedData().map((product, index) => (
                    <ProductCard product={product} key={index} />
                ))
            );
        }
    }
}

export default withRouter(Products);