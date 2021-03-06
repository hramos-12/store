import React, { Component } from 'react';
import { Breadcrumb, Icon, Dropdown, Button, Divider, Menu, Drawer } from 'antd';
import { Link } from 'react-router-dom';

import Filters from './filters/Filters';
import QueryResults from '../../QueryResults';



class ListingHeader extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showDrawer: false,
            pathname: this.props.location.pathname,
            selectedKey: "3" //padrao
        }

        this.handleDrawer = this.handleDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    componentDidUpdate() {
        if(this.props.pathname !== undefined && this.state.pathname !== this.props.pathname) {
            this.setState({
                pathname: this.props.pathname
            })
        }
    }

    handleDrawer() {
        this.setState({ showDrawer: true });
    }

    closeDrawer() {
        this.setState({ showDrawer: false });
    }

    getBreadcrumbItems() {
        const paths = this.state.pathname.slice(1).split('/');
        
        const count = paths.length;

        var url = '';

        return(
            paths.map((path, index) => {
                url += '/' + path;

                if(count -1 === index) {
                    return <Breadcrumb.Item key={index}>
                        {path.charAt(0).toUpperCase() + path.slice(1)}
                    </Breadcrumb.Item>
                } else {
                    return <Breadcrumb.Item key={index}>
                        <Link to={url} >{path.charAt(0).toUpperCase() + path.slice(1)}</Link>
                    </Breadcrumb.Item>
                }                
            })
        );
    }

    handleChange(data) {
        this.setState({ selectedKey: data.key });
        this.props.onOrderChange(data);
    }

    render() {
        const OrderMenu = (
            <Menu selectedKeys={[ this.state.selectedKey ]} onClick={this.handleChange}>
                <Menu.Item key="0">Menor preço</Menu.Item>
                <Menu.Item key="1">Maior preço</Menu.Item>
                <Menu.Item key="2">Em promoção</Menu.Item>
                <Menu.Item key="3">Padrão</Menu.Item>
            </Menu>
        );
        return (
            <div className="listing-header">
                <Breadcrumb >
                    <Breadcrumb.Item><Link to="/"><Icon type="home" /></Link></Breadcrumb.Item>
                    {this.getBreadcrumbItems()}
                </Breadcrumb>

                <QueryResults data={this.props.data} />

                <Divider className="mobile" style={{ margin: '12px 0' }}/>

                <div className="listing-actions">
                    <Button icon="filter" className="mobile btn-clean" onClick={this.handleDrawer} shape="circle"></Button>
                    <Drawer title="Filtros"
                        placement="right"
                        visible={this.state.showDrawer}
                        onClose={this.closeDrawer}>
                        <Filters
                            match={this.props.match}
                            closeDrawer={this.closeDrawer}
                            onPriceChange={this.props.onPriceChange}
                            onGenderChange={this.props.onGenderChange}
                            onCategoryChange={this.props.onCategoryChange} />
                    </Drawer>
                    <Dropdown overlay={OrderMenu} trigger={["click"]}>
                        <Button icon="bars" shape="circle-outline" className="btn-clean"></Button>
                    </Dropdown>
                </div>
            </div>
        );
    }
}

export default ListingHeader;