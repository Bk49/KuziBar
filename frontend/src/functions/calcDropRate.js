const calcDropRate = (lottery_items) => {
    let tierCount = [0, 0, 0, 0, 0, 0, 0];
    for (let { tier } of lottery_items)
        tierCount[tier - 1] = tierCount[tier - 1] + 1;
    return [
        5.0 / tierCount[0],
        8.0 / tierCount[1],
        12.0 / tierCount[2],
        15.0 / tierCount[3],
        18.0 / tierCount[4],
        20.0 / tierCount[5],
        22.0 / tierCount[6],
    ];
};

export default calcDropRate;
