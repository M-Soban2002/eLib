import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    description: {
        type: String,
        required: true
    },

    isPublished: {
        type: Boolean,
        required: true,
        default: true
    },

    thumbNail: {
        type: String,
    },

    audioAvailable: {
        type: Boolean,
        default: false
    },



}, {timestamps: true})


bookSchema.plugin(mongooseAggregatePaginate);

const Book = mongoose.model("Book", bookSchema);

export {Book};