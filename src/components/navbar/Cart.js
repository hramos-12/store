import React, { Component } from 'react';
import { Empty, List } from 'antd';
import { Link } from 'react-router-dom';
import ProductPrice from '../layout/products/ProductPrice';

class Cart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cart: JSON.parse(localStorage.getItem('cart')) || null,
            total: 0
        }

        this.handleTotal = this.handleTotal.bind(this);
    }
    componentDidMount() {
        
        var cart = (JSON.parse(localStorage.getItem('cart')));

        if(cart != null) {
            this.setState({ cart: cart }, () => {
                this.handleTotal();
            })
        }
    }

    
    handleTotal() {
        let total = 0;
        this.state.cart.forEach((element) => {
            total += (element.quantity * element.price);
        })

        this.setState({ total: parseInt(total) });
    }

    render() {
        this.props.store.subscribe(() => {
            const cart = (JSON.parse(localStorage.getItem('cart')));
            
			this.setState({ cart: cart }, () => {
                this.handleTotal();
            });
        });
        
        if(this.props.store.getState().cartCount <= 0) {
            return(
                <Empty style={{ width: 350 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            );
    
        }
        return(
            <div>
                <div style={{ minWidth: 350, overflowY: 'auto', maxHeight: 300 }}>
                    <List
                        dataSource={this.state.cart}
                        renderItem={item => (
                            <List.Item key={item.id}>
                                <List.Item.Meta
                                    avatar={<img alt="" width="62" src={item.images[0]} />}
                                    title={
                                        <div className="flex">
                                            <h3 className="grow">{item.name}</h3>
                                            <span style={{ marginLeft: 12, fontSize: 22 }}><ProductPrice product={item} /></span>
                                        </div>
                                    }
                                    description={
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span>Tamanho: {item.size}</span>
                                                <span>Quantidade: {item.quantity}</span>
                                        </div>}
                                />
                        
                            </List.Item>
                        )}>
                        
                    </List>
                </div>
                <List.Item>
                    <div style={{ width: '100%' }}>
                        <p style={{ textAlign: 'center' }}>
                            <strong>TOTAL:&nbsp;</strong>
                            <span className="product-price" style={{ fontSize: 22 }}>{this.state.total}</span>
                        </p>
                    </div>
                </List.Item>
                <Link onClick={() => this.props.closePopover(false)} to="/carrinho" className="ant-btn ant-btn-primary ant-btn-lg ant-btn-block"><strong>VER MINHA COMPRA</strong></Link>
            </div>
        );
    }
}

export default Cart;