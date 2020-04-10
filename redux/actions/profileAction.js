/* eslint-disable */

const otherUserProfile = (data) => {
    return {
        type: "OTHER_USER_PROFILE",
        data
    }
}
const removeDate = () => {
    return {
        type: "REMOVE_DATA",
    }
}

export {
    otherUserProfile,
    removeDate
}