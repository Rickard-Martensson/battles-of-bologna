// // BUTTON_LAYOUT.forEach(function (item, index) {
// //     //console.log(item, index);
// //     ctx.drawImage(Images.button1,
// //         0 * 0,
// //         0 * 0,
// //         34,
// //         34,
// //         (item.x - BUTTON_SIZE / 2) * S,
// //         (item.y - BUTTON_SIZE / 2) * S,
// //         BUTTON_SIZE * S,
// //         BUTTON_SIZE * S
// //     );
// // });


// // Object.keys(this.players).forEach((key, val) => {
// //     let playerGold = this.players[key].gold;
// //     let playerGoldPerTurn = this.players[key].goldPerTurn
// //     ctx.fillText(Math.floor(playerGold),
// //         (UI_POS.gold.x + val * (GAME_WIDTH - 2 * UI_POS.gold.x)) * S,
// //         UI_POS.gold.y * S
// //     );
// //     ctx.fillText(Math.floor(playerGoldPerTurn),
// //         (UI_POS.goldPerTurn.x + val * (GAME_WIDTH - 2 * UI_POS.goldPerTurn.x)) * S,
// //         UI_POS.goldPerTurn.y * S
// //     );

// // });


// // isIdle(bool) {
// //     if (bool) {
// //         if (this.range > 0) {
// //             this.attack(self)
// //             this.currentSpeed = 0;
// //             this.isMoving = false
// //         }
// //         else {
// //             this.currentAnimation = "idle"
// //             this.currentSpeed = 0;
// //             this.isMoving = false
// //         }
// //     }
// //     else {
// //         this.currentAnimation = "walk"
// //         this.currentSpeed = this.speed;
// //         this.isMoving = true;
// //         this.delayAtkTime = null;
// //     }
// // }


// // canMove(game) {
// //     var myAtkPos = this.pos.x + (this.meleRange * this.direction / 2);
// //     let distToNext = game.distToNextSprite(this)
// //     console.log(distToNext.len, this.meleRange + 1, "kachow")
// //     if (distToNext.len < this.meleRange + 1) {
// //         console.log("yea")
// //         this.currentSpeed = distToNext.sprite.currentSpeed;
// //     }
// //     else { this.currentSpeed = this.speed }
// //     for (var i in game.sprites) {
// //         let loopSprite = game.sprites[i]
// //         if (loopSprite != this) {
// //             if (Math.abs(loopSprite.pos.x - myAtkPos) + .1 < this.meleRange / 2) {
// //                 if (loopSprite.row == this.row) {
// //                     if (loopSprite.team != this.team) {
// //                         this.attack(loopSprite)
// //                     }
// //                     else if (loopSprite.team == this.team) {
// //                         this.isIdle(true)
// //                     }
// //                     return;

// //                 }
// //                 else if (this.abilities.has("changeRow")) {
// //                     if (loopSprite.team != this.team) {
// //                         this.row = 0;
// //                     }
// //                     //if this.DRAW_SIZE
// //                 }
// //             }
// //         }
// //     }
// //     //this.isIdle(false)
// // }



// changeBackground4(timePassed) {
//         let totalCycleTime = (CYCLE_TIME * 500)
//         let currentTime = timePassed % totalCycleTime
//         let ratioTime = currentTime / totalCycleTime

//         if (ratioTime < NIGHT_TIME) {
//                 console.log("day")
//                 background1.classList.add("bg-day");
//                 background1.classList.remove("bg-night");
//                 if (ratioTime < DAY_TIME - DUSK_TIME) {
//                         background2.classList.add("bg-dusk");
//                         background2.style.opacity = ratioTime / DAY_TIME - DUSK_TIME
//                 }
//                 else if (ratioTime > NIGHT_TIME - DUSK_TIME) {
//                         background2.classList.add("bg-dusk");
//                         background2.style.opacity = (ratioTime - (NIGHT_TIME - DUSK_TIME)) / NIGHT_TIME
//                 }
//                 else {
//                         background2.style.opacity = 0
//                 }
//         }
//         else {
//                 console.log("night")
//                 background1.classList.add("bg-night");
//                 background1.classList.remove("bg-day");
//                 if (ratioTime < NIGHT_TIME + DUSK_TIME) {
//                         background2.classList.add("bg-dusk");
//                         background2.style.opacity = 1 - ((ratioTime - NIGHT_TIME) / (NIGHT_TIME + DUSK_TIME))
//                 }
//                 else if (ratioTime > 1 - DUSK_TIME) {
//                         background2.classList.add("bg-dusk");
//                         background2.style.opacity = 0.5
//                 }
//                 else {
//                         background2.style.opacity = 0
//                 }
//         }

// }

// changeBackground15(timePassed) {
//         background1.classList
//         background2.classList.add("bg-night");
//         background2.classList.remove("bg-dusk");
//         background2.style.opacity = 0.5;
//         var cols = document.getElementsByClassName('bg-any');
//         cols[1].style.opacity = 0.5

//         //console.log("hejhej")
//         // canvas.background - image = url('bilder/background_1_night.png');
// }


// changeBackground2(timePassed) {
//         let milliSecondsPassed = timePassed % 30000
//         console.log(milliSecondsPassed)
//         let alpha = 1.0;

//         let background = ""
//         let foreground = ""
//         // 0-10 10-15 15-25 25-30
//         if (milliSecondsPassed < 10000) {
//                 background = "background_dusk"
//                 foreground = "background_day"
//                 alpha = milliSecondsPassed / 5000
//         }
//         else if (milliSecondsPassed < 15000) {
//                 background = "background_day"
//                 foreground = "background_dusk"
//                 alpha = (milliSecondsPassed - 10000) / 5000
//         }
//         else if (milliSecondsPassed < 25000) {
//                 background = "background_dusk"
//                 foreground = "background_night"
//                 alpha = (milliSecondsPassed - 15000) / 10000
//         }
//         else {
//                 background = "background_night"
//                 foreground = "background_dusk"
//                 alpha = (milliSecondsPassed - 25000) / 5000
//         }

//         let timeOfDay = "day"
//         let imgPostName = "background"
//         let imgName = imgPostName + "_" + timeOfDay

//         // if (DRAW_NEAREST_NEIGHBOUR) { ctx.imageSmoothingEnabled = false }
//         ctx.imageSmoothingEnabled = false
//         ctx.globalAlpha = 1.0;
//         ctx.drawImage(Images[background],
//                 0, //frame
//                 0,
//                 320,
//                 180,
//                 0,
//                 0,
//                 320 * S,
//                 180 * S
//         );

//         ctx.globalAlpha = alpha;
//         ctx.drawImage(Images[foreground],
//                 0, //frame
//                 0,
//                 320,
//                 180,
//                 0,
//                 0,
//                 320 * S,
//                 180 * S
//         );
//         ctx.globalAlpha = 1.0;



// }