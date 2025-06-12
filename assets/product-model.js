var productMediaModel = {
    loadShopifyXR() {
        Shopify.loadFeatures([{
                name: 'shopify-xr',
                version: '1.0',
                onLoad: this.setupShopifyXR.bind(this),
            },
            {
                name: 'model-viewer-ui',
                version: '1.0',
                onLoad: (function() {
                    document.querySelectorAll('.product-model-item').forEach((model) => {
                        let model3D = model.querySelector('model-viewer');
                        model.modelViewerUI = new Shopify.ModelViewerUI(model3D);

                        // Ensure slider is fully initialized
                        model3D.addEventListener('shopify_model_viewer_ui_toggle_play', function(evt) {
                            let mediaParent = model.closest('[data-product-main-media]');
                            
                            if (mediaParent && $(mediaParent).hasClass('slick-initialized')) {
                                $(mediaParent).slick('slickSetOption', 'draggable', false);
                                $(mediaParent).slick('slickSetOption', 'swipe', false);
                            }

                            model.querySelectorAll('.close-product-model').forEach(el => {
                                el.classList.remove('hidden');
                            });

                           
                           const getMainWrapper = model.closest('[data-product-wrapper]');
                           if(getMainWrapper){
                                getMainWrapper.querySelectorAll(".product-model-item").forEach(getmodel => {
                                    if(getmodel != model){
                                        getmodel.modelViewerUI.pause();
                                    }
                                });
                                getMainWrapper.querySelectorAll(".youtube_video,.youtube-video, iframe[src*='www.youtube.com']").forEach(video => {
                                            video.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*");
                                });

                                getMainWrapper.querySelectorAll(".vimeo_video,.vimeo-video, iframe[src*='player.vimeo.com']").forEach(video => {
                                        video.contentWindow.postMessage('{"method":"pause"}', "*");
                                });

                                getMainWrapper.querySelectorAll("video").forEach(video => {
                                        video.pause();
                                });
                           }

                        }.bind(this));

                        model3D.addEventListener('shopify_model_viewer_ui_toggle_pause', function(evt) {
                            let mediaParent = model.closest('[data-product-main-media]');
                            if (mediaParent && $(mediaParent).hasClass('slick-initialized')) {
                                const checkCurrentSlide = mediaParent.querySelector('.slick-current');
                                // console.log(checkCurrentSlide);
                                if (checkCurrentSlide) {
                                const checkModel = checkCurrentSlide.querySelector('.product-model-item');
                                // console.log(checkModel);
                                if(!checkModel){
                                    $(mediaParent).slick('slickSetOption', 'draggable', true);
                                    $(mediaParent).slick('slickSetOption', 'swipe', true);
                                }
                              }
                            }
                            model.querySelectorAll('.close-product-model').forEach(el => {
                                el.classList.add('hidden');
                            });
                        }.bind(this));

                        model.querySelectorAll('.close-product-model').forEach(el => {
                            el.addEventListener('click', function() {
                                if (model3D) {
                                    model.modelViewerUI.pause();
                                }
                            }.bind(this));
                        });

                    });

                })
            }
        ]);
    },

    setupShopifyXR(errors) {
        if (!errors) {
            if (!window.ShopifyXR) {
                document.addEventListener('shopify_xr_initialized', () =>
                    this.setupShopifyXR()
                );
                return;
            }
            document.querySelectorAll('[id^="product3DModel-"]').forEach((model) => {
                window.ShopifyXR.addModels(JSON.parse(model.textContent));
            });
            window.ShopifyXR.setupXRElements();
        }
    },
};

function productMedia3dModel(section = document) {
    let productModel = document.querySelectorAll('[id^="product3DModel-"]');
    if (productMediaModel && productModel.length > 0) {
        productMediaModel.loadShopifyXR();
    }
}

document.addEventListener("DOMContentLoaded", productMedia3dModel ,false);
// document.addEventListener("shopify:section:load",productMedia3dModel ,false );
