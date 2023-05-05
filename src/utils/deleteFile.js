import { ref, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export const deleteFile = async (url) => {

    const desertRef = ref(storage, 'students/' + getFileNameFromUrl(url));

    return deleteObject(desertRef)
}

function getFileNameFromUrl(url) {
    let filename = url.split('https://firebasestorage.googleapis.com/v0/b/brew-crew-7b2c8.appspot.com/o/students%2F')[1].split('?alt')[0]
    return filename
}