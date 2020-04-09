/* eslint-disable */

import React from 'react'
import {
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createBottomTabNavigator } from 'react-navigation-tabs'
import ForgetPassword from './screens/ForgetPassword'
import Login from './screens/Login'
import LandingScreen from './screens/Landing'
import SignUp from './screens/SignupScreen'
import Profile from './screens/Profile'
import Feedback from './screens/Feedback'
import EmailAccount from './screens/CreateEmailAccount'
import SmsCode from './screens/SmsCode'
import CodeConfirmation from './screens/SmsConfirmation'
import EditProfile from './screens/EditProfile'
import Messages from './screens/Messages'
import Blog from './screens/Blog'
import MessageChat from './screens/MessageChat';
import PostBlog from './screens/PostBlog';
import BlogDetail from './screens/BlogDetail';
import Detail from './screens/Detail';
import Yourchart from './screens/Yourchart';
import Checkout from './screens/Checkout';
import MyOrders from './screens/MyOrders';
import AddPhoto from './screens/AddPhoto';
import MyAddress from './screens/MyAddress';
import Payment from './screens/Payment';
import SelectBlog from './screens/SelectBlog';
import BlogCategory from './screens/BlogCategory';
import Privacy from './screens/Privacy';
import Terms from './screens/Terms';
import Support from './screens/Support';
import Shop from './screens/Shop';
import AddProduct from './screens/AddProduct'
import ProductPay from './screens/ProductPay'
import SavedCards from './screens/SavedCards'
import SearchUsers from './screens/SearchUsers'
import Comments from './screens/Comments'
import { Icon } from 'react-native-elements'
import { themeColor, pinkColor } from './Constant/index'

const AuthStack = createStackNavigator({
  Landing: {
    screen: LandingScreen,
    navigationOptions: {
      headerTitle: 'Landing'
    }
  },
  SignIn: {
    screen: Login,
    navigationOptions: {
      headerTitle: 'Sign In'
    }
  },
  CreateAccount: {
    screen: SignUp,
    navigationOptions: {
      headerTitle: 'Create Account'
    }
  },
  SmsCode: {
    screen: SmsCode,
    navigationOptions: {
      headerTitle: 'Create Account'
    }
  },
  EmailAccount: {
    screen: EmailAccount,
    navigationOptions: {
      headerTitle: 'Create Account'
    }
  },
  CodeConfirmation: {
    screen: CodeConfirmation,
    navigationOptions: {
      headerTitle: 'Create Account'
    }
  },
  ForgotPassword: {
    screen: ForgetPassword,
    navigationOptions: {
      headerTitle: 'Forgot Password'
    }
  },
  BlogCategory: {
    screen: BlogCategory,
    navigationOptions: {
      headerTitle: 'Feedback'
    }
  },
})


const HomeStack = createStackNavigator({
  Payment: {
    screen: Payment,
    navigationOptions: {
      headerTitle: 'Feedback'
    }
  },
  Support: {
    screen: Support,
    navigationOptions: {
      headerTitle: 'Feedback'
    }
  },
  SelectBlog: {
    screen: SelectBlog,
    navigationOptions: {
      headerTitle: 'Feedback'
    }
  },
  MyAddress: {
    screen: MyAddress,
    navigationOptions: {
      headerTitle: 'Feedback'
    }
  },
  AddPhoto: {
    screen: AddPhoto,
    navigationOptions: {
      headerTitle: 'Feedback'
    }
  },
  MyOrders: {
    screen: MyOrders,
    navigationOptions: {
      headerTitle: 'Feedback'
    }
  },
  Checkout: {
    screen: Checkout,
    navigationOptions: {
      headerTitle: 'Feedback'
    }
  },
  Yourchart: {
    screen: Yourchart,
    navigationOptions: {
      headerTitle: 'Feedback'
    }
  },
  Detail: {
    screen: Detail,
    navigationOptions: {
      headerTitle: 'Feedback'
    }
  },
  Privacy: {
    screen: Privacy,
    navigationOptions: {
      headerTitle: 'Feedback'
    }
  },

  BlogDetail: {
    screen: BlogDetail,
    navigationOptions: {
      headerTitle: 'Feedback'
    }
  },
  PostBlog: {
    screen: PostBlog,
    navigationOptions: {
      headerTitle: 'Feedback'
    }
  },
  Blog: {
    screen: Blog,
    navigationOptions: {
      headerTitle: 'Feedback'
    }
  },
  Messages: {
    screen: Messages,
    navigationOptions: {
      headerTitle: 'Feedback'
    }
  },
  Chat: {
    screen: MessageChat,
    navigationOptions: {
      headerTitle: 'Feedback'
    }
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      headerTitle: 'Feedback'
    }
  },

  Feedback: {
    screen: Feedback,
    navigationOptions: {
      headerTitle: 'Feedback'
    }
  },
  EditProfile: {
    screen: EditProfile,
    navigationOptions: {
      headerTitle: 'Feedback'
    },
  },
  Shop: {
    screen: Shop,
    navigationOptions: {
      headerTitle: 'Shop'
    },
  },
  AddProduct: {
    screen: AddProduct,
    navigationOptions: {
      headerTitle: 'Shop'
    }
  },
  ProductPay: {
    screen: ProductPay,
    navigationOptions: {
      headerTitle: 'Payment'
    }
  },
  Terms: {
    screen: Terms,
    navigationOptions: {
      headerTitle: 'Payment'
    }
  },
  SavedCards: {
    screen: SavedCards,
    navigationOptions: {
      headerTitle: 'Saved Cards'
    }
  },
  SearchUsers: {
    screen: SearchUsers,
    navigationOptions: {
      headerTitle: 'Search Users'
    }
  },
  Comments: {
    screen: Comments,
    navigationOptions: {
      headerTitle: 'Search Users'
    }
  }
}, { initialRouteName: 'Blog', header: null })
const SearchStack = createStackNavigator({
  SearchUsers: {
    screen: SearchUsers,
    navigationOptions: {
      header: null
    }
  },
}, { initialRouteName: 'SearchUsers', });
const PostBlogStack = createStackNavigator({
  PostBlog: {
    screen: PostBlog,
    navigationOptions: {
      header: null
    }
  },
}, { initialRouteName: 'PostBlog' });
const ShoppingStack = createStackNavigator({
  Shop: {
    screen: Shop,
    navigationOptions: {
      header: null
    }
  },
}, { initialRouteName: 'Shop' });
const ProfileStack = createStackNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: {
      header: null
    }
  },
}, { initialRouteName: 'Profile' });

const MainTabs = createBottomTabNavigator({
  Blogs: {
    screen: HomeStack,
    navigationOptions: {
      title: "Blogs",
      tabBarIcon: ({ tintColor }) => <Icon size={20} color={'#fff'}
        type={'material-community'} name={'blogger'} color={tintColor} />
    },
  },
  Search: {
    screen: SearchStack,
    navigationOptions: {
      title: "Search",
      tabBarIcon: ({ tintColor }) => <Icon size={20} color={'#fff'}
        type={'font-awesome'} name={'search'} color={tintColor} />
    },
  },
  PostBlog: {
    screen: PostBlogStack,
    navigationOptions: {
      title: "Post Blog",
      tabBarIcon: ({ tintColor }) => <Icon size={20} color={'#fff'}
        type={'font-awesome'} name={'pencil'} color={tintColor} />

    },
  },
  Shopping: {
    screen: ShoppingStack,
    navigationOptions: {
      title: "Shop",
      tabBarIcon: ({ tintColor }) => <Icon size={20} color={'#fff'}
        type={'font-awesome'} name={'shopping-cart'} color={tintColor} />
    },
  },
  UserProfile: {
    screen: ProfileStack,
    navigationOptions: {
      title: "Profile",
      tabBarIcon: ({ tintColor }) => <Icon size={20} color={'#fff'}
        type={'feather'} name={'user'} color={tintColor} />
    },
  },
}, {
  initialRouteName: 'Blogs',
  headerMode: 'none',
  tabBarOptions: {
    keyboardHidesTabBar: true,
    tabStyle: { backgroundColor: themeColor },
    activeTintColor: '#ff718d',
    inactiveTintColor: '#fff',
  },
  
});

const MainDrawer = createDrawerNavigator({
  MainTabs: MainTabs,
});
const App = createSwitchNavigator({
  Auth: {
    screen: AuthStack
  },
  App: {
    screen: MainDrawer
  },
})

const Routes = createAppContainer(App)

export default Routes

                                      // const HomeStack = createStackNavigator({
                                      //   Home: {
                                      //     screen: Home,
                                      //     navigationOptions: {
                                      //       headerTitle: 'Home',
                                      //     },
                                      //   },
                                      //   Search: {
                                      //     screen: Search,
                                      //     navigationOptions: {
                                      //       headerTitle: 'Search'
                                      //     }
                                      //   },
                                      //   EventDetail: {
                                      //     screen: EventDetail,
                                      //     navigationOptions: {
                                      //       headerTitle: 'EventDetail',

                                      //     }
                                      //   },
                                      // }, { initialRouteName: 'Home', })
                                      // const EventsStack = createStackNavigator({
                                      //   EventsScreen: {
                                      //     screen: Events,
                                      //     navigationOptions: {
                                      //       header: null
                                      //     }
                                      //   },
                                      // }, { initialRouteName: 'EventsScreen', });

                                      // const TicketStack = createStackNavigator({
                                      //   Ticket: {
                                      //     screen: Ticket,
                                      //     navigationOptions: {
                                      //       header: null
                                      //     }
                                      //   },
                                      // }, { initialRouteName: 'Ticket' });

                                      // const NotificationStack = createStackNavigator({
                                      //   Notification: {
                                      //     screen: Notification,
                                      //     navigationOptions: {
                                      //       header: null
                                      //     }
                                      //   },
                                      // }, { initialRouteName: 'Notification' });

                                      // const ProfileStack = createStackNavigator({
                                      //   Profile: {
                                      //     screen: Profile,
                                      //     navigationOptions: {
                                      //       header: null
                                      //     }
                                      //   },
                                      // }, { initialRouteName: 'Profile' });

                                      // const MainTabs = createBottomTabNavigator({
                                      //   Home: {
                                      //     screen: HomeStack,
                                      //     navigationOptions: {
                                      //       title: "Home",
                                      //       tabBarLabel : 'Home',
                                      //       tabBarIcon : ({tintColor})=> <Icon size = {20} type = {'font-awesome'} name = {'home'} color = {tintColor} />
                                      //     },
                                      //   },
                                      //   Events: {
                                      //     screen: EventsStack,
                                      //     navigationOptions: {
                                      //       title: "Events",
                                      //       tabBarIcon : ({tintColor})=> <Icon size = {20} type = {'font-awesome'} name = {'calendar'} color = {tintColor} />
                                      //     },
                                      //   },
                                      //   Tickets: {
                                      //     screen: TicketStack,
                                      //     navigationOptions: {
                                      //       title: "Tickets",
                                      //       tabBarIcon : ({tintColor})=> <Icon size = {20} type = {'font-awesome'} name = {'ticket'} color = {tintColor} />

                                      //     },
                                      //   },
                                      //   Notification: {
                                      //     screen: NotificationStack,
                                      //     navigationOptions: {
                                      //       title: "Notifications",
                                      //       tabBarIcon : ({tintColor})=> <Icon size = {20} type = {'font-awesome'} name = {'bell-o'} color = {tintColor} />
                                      //     },
                                      //   },
                                      //   Profile: {
                                      //     screen: ProfileStack,
                                      //     navigationOptions: {
                                      //       title: "Profile",
                                      //       tabBarIcon : ({tintColor})=> <Icon size = {20} type = {'feather'} name = {'user'} color = {tintColor} />
                                      //     },
                                      //   },
                                      // }, {
                                      //   initialRouteName: 'Home',
                                      //   headerMode: 'none',
                                      //   tabBarOptions: {
                                      //     keyboardHidesTabBar: true
                                      //   },
                                      //   defaultNavigationOptions : ({navigation})=>({
                                      //     tabBarVisible : navigation.state.key === 'Home' && navigation.state.routes[1] ? false : true 
                                      //   })
                                      //   // defaultNavigationOptions: ({ navigation ,  }) => ({
                                      //   //     tabBarComponent: (props) => <BottomComponent
                                      //   //       routeName={navigation.state.routeName}
                                      //   //       {...props} />
                                      //   //      }),
                                      // });
                                      // const MainDrawer = createDrawerNavigator({
                                      //   MainTabs: MainTabs,
                                      // });

                                      // const AppModalStack = createStackNavigator(
                                      //   {
                                      //     App: MainDrawer,
                                      //   },
                                      //   {
                                      //     mode: "modal",
                                      //     headerMode: "none"
                                      //   }
                                      // );

                                      // const App = createSwitchNavigator({
                                      //   App: {
                                      //     screen: AppModalStack,
                                      //   },
                                      // });

                                      // const Routes = createAppContainer(App)