import uploadImage from "../functions/uploadImage";
import instance, { authInstance } from "./config";

const publishLottery = async (lottery) => {
    const now = Date.now();
    const date = new Date();
    const date_created = `${date.getFullYear()}-${
        date.getMonth() + 1
    }-${date.getDate()}`;

    const bucketUrl = `https://mochi-bucket.s3.ap-southeast-1.amazonaws.com/`;

    try {
        const { image, lottery_items, lottery_name, price } = lottery;
        const base64Imgs = [];
        const data = {
            image: image,
            lottery_name: lottery_name,
            lottery_items: [],
            price: price,
            status: 1,
            date_created: date_created,
            creator_id: localStorage.getItem("userId"),
            remaining_tickets: lottery_items.length,
        };

        if (image && image.length > 0) {
            const mime = image.match(
                /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
            );
            const imgUrl = `lottery/${lottery_name}/lottery_image${now}${mime[1].substring(
                6
            )}`;
            base64Imgs.push({ imageUrl: imgUrl, base64: image });
            data.image = `${bucketUrl}${imgUrl}`;
        }

        if (lottery_items && lottery_items.length > 0) {
            for (let i = 0; i < lottery_items.length; i++) {
                const itemName = lottery_items[i].item_name;
                const itemImage = lottery_items[i].image;
                const skins = lottery_items[i].skins;
                if (
                    itemName &&
                    itemImage &&
                    itemName.length > 0 &&
                    itemName.length > 0
                ) {
                    const mime = image.match(
                        /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
                    );
                    const imgUrl = `lottery/${lottery_name}/${itemName}${now}${mime[1].substring(
                        6
                    )}`;
                    base64Imgs.push({ imageUrl: imgUrl, base64: itemImage });
                    const { item_name, tier } = lottery_items[i];
                    data.lottery_items.push({
                        image: `${bucketUrl}${imgUrl}`,
                        item_name: item_name,
                        tier: tier,
                        skins: [],
                    });
                }

                if (skins && skins.length > 0) {
                    for (let j = 0; j < skins.length; j++) {
                        const { skin_name, skin_image } = skins[j];
                        if (
                            skin_name &&
                            skin_image &&
                            skin_name.length > 0 &&
                            skin_image.length > 0
                        ) {
                            const mime = image.match(
                                /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
                            );
                            const imgUrl = `lottery/${lottery_name}/${itemName}/${skin_name}${now}${mime[1].substring(
                                6
                            )}`;
                            base64Imgs.push({
                                imageUrl: imgUrl,
                                base64: skin_image,
                            });
                            data.lottery_items[i].skins.push({
                                skin_name: skin_name,
                                skin_image: `${bucketUrl}${imgUrl}`,
                            });
                        }
                    }
                }
            }
        }

        await uploadImage(base64Imgs);
        return await authInstance.post(`lottery/`, data, {
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
    } catch (e) {
        throw e;
    }
};

const saveLottery = async (lottery) => {
    const now = Date.now();
    const date = new Date();
    const date_created = `${date.getFullYear()}-${
        date.getMonth() + 1
    }-${date.getDate()}`;

    const bucketUrl = `https://mochi-bucket.s3.ap-southeast-1.amazonaws.com/`;

    try {
        const { image, lottery_items, lottery_name, price } = lottery;
        const base64Imgs = [];
        const data = {
            image: image,
            lottery_name: lottery_name,
            lottery_items: [],
            price: price,
            status: 0,
            date_created: date_created,
            creator_id: localStorage.getItem("userId"),
            remaining_tickets: lottery_items.length,
        };

        if (image && image.length > 0) {
            const mime = image.match(
                /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
            );
            const imgUrl = `lottery/${lottery_name}/lottery_image${now}${mime[1].substring(
                6
            )}`;
            base64Imgs.push({ imageUrl: imgUrl, base64: image });
            data.image = `${bucketUrl}${imgUrl}`;
        }

        if (lottery_items && lottery_items.length > 0) {
            for (let i = 0; i < lottery_items.length; i++) {
                const itemName = lottery_items[i].item_name;
                const itemImage = lottery_items[i].image;
                const skins = lottery_items[i].skins;
                if (
                    itemName &&
                    itemImage &&
                    itemName.length > 0 &&
                    itemName.length > 0
                ) {
                    const mime = image.match(
                        /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
                    );
                    const imgUrl = `lottery/${lottery_name}/${itemName}${now}${mime[1].substring(
                        6
                    )}`;
                    base64Imgs.push({ imageUrl: imgUrl, base64: itemImage });
                    const { item_name, tier } = lottery_items[i];
                    data.lottery_items.push({
                        image: `${bucketUrl}${imgUrl}`,
                        item_name: item_name,
                        tier: tier,
                        skins: [],
                    });
                }

                if (skins && skins.length > 0) {
                    for (let j = 0; j < skins.length; j++) {
                        const { skin_name, skin_image } = skins[j];
                        if (
                            skin_name &&
                            skin_image &&
                            skin_name.length > 0 &&
                            skin_image.length > 0
                        ) {
                            const mime = image.match(
                                /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
                            );
                            const imgUrl = `lottery/${lottery_name}/${itemName}/${skin_name}${now}${mime[1].substring(
                                6
                            )}`;
                            base64Imgs.push({
                                imageUrl: imgUrl,
                                base64: skin_image,
                            });
                            data.lottery_items[i].skins.push({
                                skin_name: skin_name,
                                skin_image: `${bucketUrl}${imgUrl}`,
                            });
                        }
                    }
                }
            }
        }

        await uploadImage(base64Imgs);
        return await authInstance.post(`lottery/`, data, {
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
    } catch (e) {
        throw e;
    }
};

const getLotteries = async () => {
    try {
        return await instance.get(
            "/lottery",
            {},
            {
                headers: {
                    accept: "application/json",
                },
            }
        );
    } catch (e) {
        throw e;
    }
};

const getLotteryItems = async (id) => {
    try {
        return await instance.get(
            `/lottery/${id}/items`,
            {},
            {
                headers: {
                    accept: "application/json",
                },
            }
        );
    } catch (e) {
        throw e;
    }
};

const getLottery = async (id) => {
    try {
        return await instance.get(
            `/lottery/${id}`,
            {},
            {
                headers: {
                    accept: "application/json",
                },
            }
        );
    } catch (e) {
        throw e;
    }
};

export {
    publishLottery,
    getLotteries,
    saveLottery,
    getLotteryItems,
    getLottery,
};
