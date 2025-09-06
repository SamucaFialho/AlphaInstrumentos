package com.github.SamucaFialho.AlphaInstrumentosMusicais.dto;

import java.math.BigDecimal;

import com.github.SamucaFialho.AlphaInstrumentosMusicais.model.Product;

public class ProductRequestUpdate {

     private BigDecimal price;

    public Product toModel(Product product){
        product.setPrice(this.price);
        return product;
    }


    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
}
