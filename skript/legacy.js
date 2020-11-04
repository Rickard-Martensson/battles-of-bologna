        // BUTTON_LAYOUT.forEach(function (item, index) {
        //     //console.log(item, index);
        //     ctx.drawImage(Images.button1,
        //         0 * 0,
        //         0 * 0,
        //         34,
        //         34,
        //         (item.x - BUTTON_SIZE / 2) * S,
        //         (item.y - BUTTON_SIZE / 2) * S,
        //         BUTTON_SIZE * S,
        //         BUTTON_SIZE * S
        //     );
        // });


                // Object.keys(this.players).forEach((key, val) => {
        //     let playerGold = this.players[key].gold;
        //     let playerGoldPerTurn = this.players[key].goldPerTurn
        //     ctx.fillText(Math.floor(playerGold),
        //         (UI_POS.gold.x + val * (GAME_WIDTH - 2 * UI_POS.gold.x)) * S,
        //         UI_POS.gold.y * S
        //     );
        //     ctx.fillText(Math.floor(playerGoldPerTurn),
        //         (UI_POS.goldPerTurn.x + val * (GAME_WIDTH - 2 * UI_POS.goldPerTurn.x)) * S,
        //         UI_POS.goldPerTurn.y * S
        //     );

        // });


            // isIdle(bool) {
    //     if (bool) {
    //         if (this.range > 0) {
    //             this.attack(self)
    //             this.currentSpeed = 0;
    //             this.isMoving = false
    //         }
    //         else {
    //             this.currentAnimation = "idle"
    //             this.currentSpeed = 0;
    //             this.isMoving = false
    //         }
    //     }
    //     else {
    //         this.currentAnimation = "walk"
    //         this.currentSpeed = this.speed;
    //         this.isMoving = true;
    //         this.delayAtkTime = null;
    //     }
    // }


        // canMove(game) {
    //     var myAtkPos = this.pos.x + (this.meleRange * this.direction / 2);
    //     let distToNext = game.distToNextSprite(this)
    //     console.log(distToNext.len, this.meleRange + 1, "kachow")
    //     if (distToNext.len < this.meleRange + 1) {
    //         console.log("yea")
    //         this.currentSpeed = distToNext.sprite.currentSpeed;
    //     }
    //     else { this.currentSpeed = this.speed }
    //     for (var i in game.sprites) {
    //         let loopSprite = game.sprites[i]
    //         if (loopSprite != this) {
    //             if (Math.abs(loopSprite.pos.x - myAtkPos) + .1 < this.meleRange / 2) {
    //                 if (loopSprite.row == this.row) {
    //                     if (loopSprite.team != this.team) {
    //                         this.attack(loopSprite)
    //                     }
    //                     else if (loopSprite.team == this.team) {
    //                         this.isIdle(true)
    //                     }
    //                     return;

    //                 }
    //                 else if (this.abilities.has("changeRow")) {
    //                     if (loopSprite.team != this.team) {
    //                         this.row = 0;
    //                     }
    //                     //if this.DRAW_SIZE
    //                 }
    //             }
    //         }
    //     }
    //     //this.isIdle(false)
    // }