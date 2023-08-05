import React, { useState, useEffect } from 'react';
import { StyleSlide } from './style'
import ImageIphone from '/src/assets/iphones.png'
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation } from 'swiper/modules';
import { BtnPrimary } from '../Global/ButtonPrimary';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';


export function Slide() {
    return (
        <>
            <StyleSlide>
                    <Swiper
                    navigation={true}
                    slidesPerView={1}
                    modules={[EffectFade, Navigation]} effect='fade'
                    className='mySwiper'
                    >
                        <SwiperSlide className='slide-01'>
                            <div className="container">
                                <div className="left animeLeft">
                                    <h2>Seu smartphone vive travando?</h2>
                                    <span>Você merece um upgrade!</span>
                                    <BtnPrimary
                                    url="#"
                                    txt="Faça o upgrade já!"
                                    />
                                </div>
                                <div className="right">
                                    <img src={ImageIphone} alt="Iphones" />
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
            </StyleSlide>
        </>
    )
}