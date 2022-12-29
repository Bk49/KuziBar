// This will be used to contain the lottery card item image that is inside each LotteryCard (Lottery Listing) and LotteryTicketCard (Inventory > Lottery Tickets)
import "../../../assets/css/components/common/image/LotteryCardItemImage.css";

const LotteryCardItemImage = ({ image }) => {
    return <img className="lottery-card-item-image" src={image} alt="" />;
};

export default LotteryCardItemImage;
