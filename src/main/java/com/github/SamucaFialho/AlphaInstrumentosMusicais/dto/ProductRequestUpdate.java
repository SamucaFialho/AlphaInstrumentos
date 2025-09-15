package com.github.SamucaFialho.AlphaInstrumentosMusicais.dto;

import java.math.BigDecimal;

import com.github.SamucaFialho.AlphaInstrumentosMusicais.model.Product;

public class ProductRequestUpdate {

     private BigDecimal price;
     private Integer quantidade;

    public Product toModel(Product product){
        product.setPrice(this.price);
        product.setQuantidade(this.quantidade);
        return product;
    }


    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }


    public Integer getQuantidade() {
        return quantidade;
    }


    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }
    
}
