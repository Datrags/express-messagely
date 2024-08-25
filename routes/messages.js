const express = requrire("express");
const router = new express.Router();
const Message = require("../models/message");
const {ensureLoggedIn} = require("../middleware/auth");
const ExpressError = require("../expressError");
/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", async (req, res, next) => {
    try {
        let message = await Message.get(req.params.id);

        if (message.to_user.username !== username && 
            message.from_user.username !== username) {
            throw new ExpressError("Cannot read this message", 401);
        }

        return res.json({message});
    } catch(e) {
        return next(e);
    }
})

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post("/", ensureLoggedIn, async (req, res, next) => {
    try{
        let {to_username, body} = req.body;
        let username = req.user.username;
        let message = await Message.create(username, to_username, body);

        return res.json({message});
    } catch(e) {
        return next(e);
    }
})

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post("/:id/read", async (req, res, next) => {
    try {
        let username = req.user.username;
        let message = await Message.get(req.params.id);

        if (message.to_user.username !== username) 
            throw new ExpressError("Cannot set to read", 401);

        let msg = await Message.markRead(req.params.id);

        return res.json({msg});
    }
    catch(e) {

    }
})


module.exports = router;