export const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export const statusOptions = ["available", "running low", "out of stock"];

export const userRolesToReadableMap = {"view": "View Only", "crud": "View & Update/Edit", "manager": "Manager", "admin": "Administrator"};