// The button for ref will be Create New Lottery! button
import React from 'react'

import TextButton from '../../../../components/common/button/TextButton'

export default {
    title:"Common/Button/TextButton",
    component: TextButton
}

const Template = args => <TextButton {...args}/>

export const Primary = Template.bind({})

Primary.args = {
    color:"#F77F00",
    text:"Login"
}