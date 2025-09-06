package com.github.SamucaFialho.AlphaInstrumentosMusicais.services;

import org.springframework.stereotype.Service;
import com.github.SamucaFialho.AlphaInstrumentosMusicais.model.Cart;
import com.github.SamucaFialho.AlphaInstrumentosMusicais.model.Product;

@Service
public class CartService {
    private final Cart cart = new Cart();

    public Cart getCart() {
        return cart;
    }

    public void addProduct(Product product) {
        cart.addProduct(product);
    }

    public void removeProduct(Product product) {
        cart.removeProduct(product);
    }

    public void clearCart() {
        cart.clear();
    }
}
