Vue.component('product', {
    props:{
        premium:{
            type: Boolean,
            required: true
        }
    },
    template:`
        <div class="product">
            <div class="product-image">
                <img :src="image" :alt="altText"/>
            </div>

            <div class="product-info">
                <h1>{{title}}</h1>
                <p>{{description}}</p>
                <p v-if="inventory > 10">In Stock</p>
                <p v-else-if="inventory <= 5 && inventory > 0">Hurry!!!! Almost Sold !</p>
                <p v-else-if="inventory <= 10 && inventory > 0">Almost Sold !</p>
                <p v-else>Out of Stock</p>
                <p>Shipping : {{shipping}}</p>
                <product_info></product_info>

                <div  v-for="(variant, index) in variants" 
                    :key="variant.variantId" 
                    class="color-box" 
                    :style="{'background-color':variant.colour}"
                    @mouseover="updateProduct(index)">
                </div>
                
                <button v-on:click="addToCart" :disabled="add_disabled">Add to Cart</button>
                
                <button v-on:click="removeFromCart" :disabled="remove_disabled">Remove From Cart</button>
            </div>

            <div>
                <h2>Reviews</h2>
                <div v-if="!reviews.length">No review yet</div>
                <ul>
                    <li v-for="review in reviews">
                        <p>Name:{{review.name}}</p>
                        <p>Review:{{review.review}}</p>
                        <p>Rating:{{review.rating}}</p>
                        <p>Rating:{{review.product_recomend}}</p>
                    </li>
                </ul>
            </div>
            <product-review @review-submitted="addReview"></product-review>
        </div>`,
    data(){
        return {
            product:'Socks',
            brand:'jocky',
            description:'Good One',
            altText:'Socks',
            selectedVariant:0,
            add_disabled:false,
            remove_disabled:false,
            variants:[
                {
                    variantId:1,
                    colour:"green",
                    variant_image:"green_socks.png",
                    variant_qty:10
    
                },
                {
                    variantId:2,
                    colour:"blue",
                    variant_image:"blue_socks.png",
                    variant_qty:20
                }
            ],
            reviews:[]
        }
    },
    methods:{
        addToCart(){
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        removeFromCart(){
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index){
            this.selectedVariant = index;
            console.log(index);
        },
        addReview(productReview){
            this.reviews.push(productReview);
        }
    },
    computed:{
        title(){
            return this.product+' '+this.brand;
        },
        image(){
            return this.variants[this.selectedVariant].variant_image;
        },
        inventory(){
            return this.variants[this.selectedVariant].variant_qty;
        },
        shipping(){
            if(this.premium == true){
                return "Free";
            }else{
                return 2.99;
            }
        }
    }
});

Vue.component('product_info', {
    template: `
            <ul>
                <li v-for="detail in details">{{detail}}</li>
            </ul>`,
    data(){
        return {
            details:["80% Cutton", "20% polyester", "Gender-neutral"],
        }
    }

});


Vue.component('product-review', {
    template: `
            <form class="review-form" @submit.prevent="onSubmit">
                <p>
                    <label for="name">Name:</label>
                    <input id="name" v-model="name" required>
                </p>

                <p>
                    <label for="review">Review:</label>
                    <textarea id="review" v-model="review" required></textarea>
                </p>

                <p>
                    <label for="rating">Rating:</label>
                    <select id="rating" v-model=rating required>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </p>

                <p>
                    <label for="product_recomend">Do you recomend this product ?:</label>
                    <input type="radio" name="product_recomend" id="product_recomend" v-model="product_recomend" value="Yes" required>Yes
                    <input type="radio" name="product_recomend" id="product_recomend" v-model="product_recomend" value="No" required>No
                </p>

                <button type="submit">Submit</button>
            </form>`,
    data(){
        return {
            name:null,
            review:null,
            rating:null,
            product_recomend:null
        }
    },
    methods:{
        onSubmit(){
            let productReview = {
                name:this.name,
                review:this.review,
                rating:this.rating,
                product_recomend:this.product_recomend
            }
            this.$emit('review-submitted', productReview)
            this.name = null
            this.review = null
            this.rating = null
            this.product_recomend = null
        }
    }

});

var app = new Vue({
    el:'#app',
    data:{
        premium:false,
        cart:[],
    },
    methods:{
        updateCart(id){
            this.cart.push(id);
            /* this.inventory -= 1;
            if(this.inventory == 0){
                this.add_disabled = true;
            }
            if(this.cart > 0){
                this.remove_disabled = false;
            } */
        },
        removeFromCart(id){
            for(var i = this.cart.length - 1; i >= 0; i--) {
                if (this.cart[i] === id) {
                    this.cart.splice(i, 1);
                    break;
                }
            }
            /* this.cart -= 1;
            this.inventory += 1;
            if(this.inventory > 0){
                this.add_disabled = false;
            }
            if(this.cart == 0){
                this.remove_disabled = true;
            } */
        }
    }
});