import React, { useState } from 'react'

export default function Test() {
    const [products, setProducts] = useState([
        {
            variant_code: "250570-L-BLU",
            size: "L",
            colour: "BLU",
            stock: true,
        },
        {
            variant_code: "250570-M-RED",
            size: "M",
            colour: "RED",
            stock: false,
        },
        {
            variant_code: "250570-M-BLU",
            size: "M",
            colour: "BLU",
            stock: false,
        },
        {
            variant_code: "250570-L-RED",
            size: "L",
            colour: "RED",
            stock: true,
        },
    ])

    function handleQuantityUpdate(index: number, e: any) {
        let arr: any = [...products];
        arr[index] = { ...arr[index], quantity: e.target.value }
        setProducts([...arr])
    }

    function handleSubmit() {
        console.log(products.filter((p: any) => p.quantity));
    }


    return (
        <div style={{}}>
            {
                products.map((obj: any, index: number) =>
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>SKU code : {obj.variant_code}</span>
                            Quantity : <input onChange={(e: any) => handleQuantityUpdate(index, e)} />
                        </div>
                        <span>variation : {obj.size}</span>
                    </div>
                )
            }
            <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}
