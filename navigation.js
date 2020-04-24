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
import Otheruser from './screens/OtherUser'
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

  AddPhoto: {
    screen: AddPhoto,
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

  Feedback: {
    screen: Feedback,
    navigationOptions: {
      headerTitle: 'Feedback'
    }
  },

  SearchUsers: {
    screen: SearchUsers,
    navigationOptions: {
      header: null
    }
  },
  Otheruser: {
    screen: Otheruser,
    navigationOptions: {
      headerTitle: 'Feedback'
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
  Comments: {
    screen: Comments,
    navigationOptions: {
      headerTitle: 'Search Users'
    }
  }
}, { initialRouteName: 'Blog', header: null })
const SearchStack = createStackNavigator({
  SelectBlog: {
    screen: SelectBlog,
    navigationOptions: {
      header: null
    }
  },

}, { initialRouteName: 'SelectBlog', });
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
  MyAddress: {
    screen: MyAddress,
    navigationOptions: {
      headerTitle: 'Feedback'
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
  EditProfile: {
    screen: EditProfile,
    navigationOptions: {
      headerTitle: 'Feedback'
    },
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
      title: "Select Blog",
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
  backBehavior: 'history',
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
