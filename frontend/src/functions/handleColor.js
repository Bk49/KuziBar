const handleColor = (tier) => {
    switch (tier) {
        case "1":
            return "red";
        case "2":
            return "orange";
        case "3":
            return "yellow";
        case "4":
            return "purple";
        case "5":
            return "blue";
        case "6":
            return "green";
        default:
            return "grey";
    }
};

export default handleColor