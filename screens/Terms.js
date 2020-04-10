import React, { Fragment } from 'react'
import {
    StyleSheet,
    Image,
    View,
    TouchableOpacity,
    FlatList,
    Text,
    ScrollView
} from 'react-native'
import { Icon } from 'react-native-elements'
import CustomHeader from '../Component/header'
import { themeColor, pinkColor } from '../Constant'

let terms = [
    {
        heading: "INTRODUCTION",
        description: `Blogstar is a social networking app that provides a platform for content creators/users to create and share content with other users on the platform. Users can share photos, videos, gifs as well as podcast and audio. Influencers can also sell goods and services within the platform if they wish.`
    },
    {
        heading: "ACCEPTANCE OF CONDITIONS",
        description: `By registering for and/or using the service in any way, including but not limited to visiting the site, you expressly acknowledge that you have read and understood the terms and conditions herein (the "Terms"), the Privacy, and agree Policy and other guidelines and policies that we may publish from time to time on the site, each of which is incorporated herein by reference.

This service is intended for lawful use by persons older than eighteen (18) years. The company reserves the right to change these Terms and Conditions, the Privacy Policy, and other company guidelines and policies posted on the site from time to time in its sole discretion, with or without notice.
        
If you continue to use the service, you agree to the revised Terms. Your use of the service is subject to the most recent version of these Terms, the policies, and guidelines published on the site at the time of such use. If you violate any part of these Terms, your permission to use the service will be terminated automatically.
        `
    },
    {
        heading: "Share your content and information when you use Blogstar services.",
        list: [
            'You are responsible for your use of the Blogstar services and for all content and information that you make available through a Blogstar service ("Content" and "Information"), including compliance with all applicable laws, rules, and regulations.',
            `You may only upload content and information that you can easily share with others. You guarantee and declare that you own all Content and Information that you post on a Blogstar Social Media Platform. You can determine how your content and information is shared via your privacy settings.`,
            `You retain your rights to all content and information that you submit, publish, or display on a Blogstar Social Media Platform. For content that falls under intellectual property rights, such as photos and videos (IP Content), you grant us a worldwide, non-exclusive, transferable, sublicensable, royalty-free license to use, copy, process, display or distribute. IP content that you place on a Blogstar Social Media Platform (IP license). In this regard, you warrant and represent that you have all the rights, powers, and authority that are necessary to grant the rights in respect of IP content that you submit to Blogstar.`,
            `This IP license is terminated when you delete your IP content in your account unless your IP content has been shared with others and has not been removed. Any deleted IP content may continue to exist in backup copies or cache for a reasonable time (but will typically not be available to others).`,
            `When you publish Content or Information using the "public" setting, it means that you allow anyone, including people who do not use Blogstar, to access and use that information and associate it with you (i.e., your name and profile photo).`
        ]
    },
    {
        heading: "Share your content and information when you use Blogstar services.",
        list: [
            'You are responsible for your use of the Blogstar services and for all content and information that you make available through a Blogstar service ("Content" and "Information"), including compliance with all applicable laws, rules, and regulations.',
            `You may only upload content and information that you can easily share with others. You guarantee and declare that you own all Content and Information that you post on a Blogstar Social Media Platform. You can determine how your content and information is shared via your privacy settings.`,
            `You retain your rights to all content and information that you submit, publish, or display on a Blogstar Social Media Platform. For content that falls under intellectual property rights, such as photos and videos (IP Content), you grant us a worldwide, non-exclusive, transferable, sublicensable, royalty-free license to use, copy, process, display or distribute. IP content that you place on a Blogstar Social Media Platform (IP license). In this regard, you warrant and represent that you have all the rights, powers, and authority that are necessary to grant the rights in respect of IP content that you submit to Blogstar.`,
            `This IP license is terminated when you delete your IP content in your account unless your IP content has been shared with others and has not been removed. Any deleted IP content may continue to exist in backup copies or cache for a reasonable time (but will typically not be available to others).`,
            `When you publish Content or Information using the "public" setting, it means that you allow anyone, including people who do not use Blogstar, to access and use that information and associate it with you (i.e., your name and profile photo).`
        ]
    },
    {
        heading: 'Profile Account',
        description: `If you choose to set up a profile account or membership account on the site, you will become a "User." During the profile registration process, you will be asked to choose a password. You agree to keep your password confidential. Users are fully responsible for all activities that occur under their account, whether authorized or unauthorized unless a third party has obtained access to a user's username and password without the user's fault or negligence. The user agrees to inform the company of unauthorized use of the user's account or any other breach of account security as soon as this becomes known to the user. All rights to the use of Services offered to a User are personal for that user and not for commercial use without the express written permission of the company. You are responsible for your interactions with other Users, external developers, or other parties with whom you communicate through the service. The company reserves the right but is not obliged to be involved in any way in disputes.`,
    },
    {
        heading: "Safety",
        description: `To keep Blogstar Services safe for all users, we need the following commitments from you:`,
        list: [
            'You will not collect or use the Content and Information of other users without their prior consent.',
            `You do not request login information or access to someone else's account.`,
            `You will not present yourself as other users and non-users of Blogstar in a manner that is intended to mislead, confuse, or deceive others.`,
            `You will not intimidate, intimidate, or harass any user.`,
            `You do not post any content which: incites hatred, threatening or pornographic, incites violence, or contains nudity or graphic or pointless violence.`,
            `You will not upload viruses and other malicious code.`,
            `You will not post unauthorized communications (example is spam).`,
            `You will not develop or use third-party applications with alcohol-related, dating, or other adult content (including advertisements) without having appropriate age-related restrictions.`,
            `You will not engage in unlawful marketing on multiple levels, such as pyramid schemes, in connection with your use of a Blogstar service.`,
            `You will not use a Blogstar service to do anything illegal, misleading, malicious, or discriminatory.`,
            `You will not do anything that could interfere with, overburden or adversely affect the correct operation or appearance of Blogstar Services, such as a denial of service attack or page display interference or other Blogstar Service functionality.`,
            `You may not use Blogstar Services for illegal purposes or to promote illegal activities.`,
            `You will not engage in, facilitate, or encourage violations of these Terms.`
        ]
    },
    {
        heading: 'Protection of the rights of other people',
        description: 'We respect the rights of other people and expect you to do the same.',
        list: [
            `You will not post any content or take any action in connection with your use of Blogstar Services that violates or otherwise infringes someone else's rights or otherwise violates the law.`,
            `We reserve the right to remove any content or information that you post with Blogstar Services if, in our reasonable opinion, we believe that they violate these Terms or our related policies.`,
            `If we remove your content for copyright infringement of someone else and you think we have deleted it by mistake, we offer you the opportunity to appeal. If your appeal is rejected, this is the final and binding decision regarding such an infringement.`,
            `If you repeatedly infringe the IP content of other users, we reserve the right to disable your account if we deem it necessary.`,
            `You will not use our copyrights or trademarks or any confusingly similar figure, except as expressly permitted with our prior written permission. All rights, titles, and interests in and to Blogstar services (except content and information provided by users) are and remain the exclusive property of Blogstar and its licensors.`,
            `If you collect information from other Blogstar Services users, you must request permission, make it clear that you (and not Blogstar) are the ones collecting their Content and Information and how you intend to use their Content and Information.`,
            `You will not post the personal identification documentation or sensitive financial information about Blogstar Services by yourself or anyone else that may be subject to appropriation or fraudulent activities.`,
            `You will not buy or sell Blogstar accounts.`
        ]
    },
    {
        heading: "RULES AND CONDUCTS",
        description: `The service is only intended for personal, non-commercial use. You are solely responsible for all your activities related to the service.

Without limitation, the following examples of User Submissions are not permitted:`,
        list: [
            `The user's submission is intentionally inaccurate, misleading, fraudulent, or false.`,
            `User submission is abusive, obscene, defamatory, offensive, profane, illegal, promotion of a crime, or infringement of another person's Privacy.`,
            `User submission must result in the transmission and distribution of a computer or mobile device virus.`,
            `Submitting the user is meant to impersonate a person or entity.`,
            `Adult content is prohibited`,
            `Everyone under the age of 18 cannot buy things on the platform`,
            `No offensive or provocative language or blemish; any approach to one of these things is blocked and removed from the platform`,
            `When users purchase items through the platform, both parties understand that there will be some form of an escrow that we will hold to ensure effective transfer of goods and services.`,
            `Items such as weapons and illegal drugs are prohibited on the platform.`,
            `False accounts are blocked and removed from the platform`,
            `Copyright content is blocked and can lead to account bans`
        ],
        lastLine: 'The company reserves the right but is not obliged, to edit, modify, remove, hide, or remove the User Submission at its sole discretion, with or without reason. Company does not guarantee that User Submissions will be made available on the site. The company reserves the right to refuse service, terminate accounts, and cancel orders if we believe that your conduct is contrary to these terms.'
    },
    {
        heading: 'MISCELLANEOUS',
        description: `If a provision of these Terms and Conditions is found to be unlawful, unenforceable or invalid, that provision will be limited or eliminated to the necessary minimum, so that these terms and conditions otherwise remain fully valid and enforceable. You agree that these Terms may be transferred or transferred by the company, in its sole discretion, to a third party in the event of a merger or sale of the company or its assets. These terms and conditions apply in addition to any other written agreement between us (a "specific agreement"). In the event of a conflict between these Terms and Conditions and a Specific Agreement, the Specific Agreement will exercise control over your rights to the service.`
    }

]
class Terms extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            category: 0
        }
    }
    static navigationOptions = {
        header: null
    }
    render() {
        const { navigation } = this.props
        let { category } = this.state
        return (
            <ScrollView stickyHeaderIndices={[0]} style={{ backgroundColor: '#323643', flex: 1 , padding : 8 }}>
                <CustomHeader navigation={navigation}
                
                title={'TERMS AND CONDITIONS'} />
                <FlatList
                    data={terms}
                    renderItem={({ item, index }) =>
                        <View key={index} style = {{marginBottom : 16}}>
                            <Text style={{ marginVertical: 6, fontWeight: 'bold', color: '#fff', fontSize: 22 }} >{item.heading}</Text>
                            <Text style={{ color: '#bbb' , flex : 1 }} >{item.description}</Text>
                            {
                                item.list && item.list[0].heading ?
                                    <Text style={{ marginVertical: 6, fontWeight: 'bold', color: '#fff', fontSize: 18 }} >{item.list[0].heading}</Text>
                                    : null
                            }
                            {
                                item.list && typeof (item.list[0]) === 'string' ?
                                    item.list.map((text, index) =>
                                        <View key={index} style={{ flexDirection: "row", marginVertical: 4 }}>
                                            <Icon name={'circle'} type={"font-awesome"} color={pinkColor} size={8}
                                                containerStyle={{ marginLeft: 12, marginTop: 5 }} />
                                            <Text style={{ color: '#bbb', marginHorizontal: 8  , flex : 1}} >{text}</Text>
                                        </View>
                                    )
                                    : null
                            }
                            {
                                item.list && typeof (item.list[1]) === 'object' ?
                                    item.list[1].map((text, index) =>
                                        text.heading ?
                                            <View key={index} style={{ marginVertical: 4 }}>
                                                <Text style={{ marginVertical: 6, fontWeight: 'bold', color: '#fff', fontSize: 18 }} >
                                                    {text.heading}</Text>
                                                <View key={index} style={{ flexDirection: "row", marginVertical: 4 }}>
                                                    <Icon name={'circle'} type={"font-awesome"} color={pinkColor} size={8}
                                                        containerStyle={{ marginLeft: 12, marginTop: 5 }} />
                                                    <Text style={{ color: '#bbb', marginHorizontal: 8 }} >{text.description}</Text>
                                                </View>
                                            </View>
                                            :
                                            <View key={index} style={{ flexDirection: "row", marginVertical: 4 }}>
                                                <Icon name={'circle'} type={"font-awesome"} color={pinkColor} size={8}
                                                    containerStyle={{ marginLeft: 12, marginTop: 5 }} />
                                                <Text style={{ color: '#bbb', marginHorizontal: 8 }} >{text}</Text>
                                            </View>
                                    )
                                    : null
                            }
                            {
                                item.lastLine ?
                                    <Text style={{ color: "#bbb" }} >{item.lastLine}</Text>
                                    : null
                            }
                        </View>
                    }
                />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
})
export default Terms
