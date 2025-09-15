package com.github.SamucaFialho.AlphaInstrumentosMusicais.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.SamucaFialho.AlphaInstrumentosMusicais.model.Cart;
import com.github.SamucaFialho.AlphaInstrumentosMusicais.model.Product;
import com.github.SamucaFialho.AlphaInstrumentosMusicais.services.CartService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {
    private static final Logger logger = LoggerFactory.getLogger(CartController.class);
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public void addToCart(@RequestBody Product product) {
        logger.info("Produto recebido para adicionar ao carrinho: {}", product);
        cartService.addProduct(product);
    }

    @GetMapping
    public Cart getCart() {
        return cartService.getCart();
    }
}
