// For items in "Customizable Items" tab

import CustomizableItemCard from "../../../../components/inventory/card/CustomizableItemCard";
import Viper from "../../../assets/images/Viper.png";

export default {
    title: "Inventory/Card/CustomizableItemCard",
    component: CustomizableItemCard,
};

const Template = (args) => <CustomizableItemCard {...args} />;

export const Base = Template.bind({});

Base.args = {
    item: {
        item_name:"Dodge Viper SRT",
        creator_name: "DeviousComet465",
        tier: "1",
        image: Viper,
        skins: new Array(5),
        date_to_finalize: "18 Feb 23",
    },
};
