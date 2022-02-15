const { type } = require("express/lib/response");
const mongoose = require("mongoose");


const groupSchema = new mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        users: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            totalContribution: {
                type: Number,
            },
            weeklyContribution: {
                type: Number,
            }
        }
        ],
        name: {
            type: String,
            required: true,

            unique: true,
            max: 50,
        },
        description: {
            type: String,
            required: true,
        },
        savingsAmount: {
            type: Number,
            default: 0
        },
        maxCapacity: {
            type: Number,
            default: 0
        },
        private: {
            type: Boolean,
            default: true
        },
        approved: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Group", groupSchema);
