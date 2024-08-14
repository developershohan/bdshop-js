// Now you can use axios in your module

import { getCartProductFromLS } from "./getCartProductFromLS.js"

const getCartProduct = ()=>{
    const lsProduct = getCartProductFromLS()

    let content = ``
    lsProduct.map((product)=>{
        console.log(product);
        
    })
}