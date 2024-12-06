export const chatUserData = [
  {
    id: 1,
    user: "Request 1",
    active: true,
    theme: "primary",
  }
];

export const chatData = [
  {
    id: 1,
    name: "Request 1",
    nickname: "",
    theme: "purple",
    chatTheme: "purple",
    fav: true,
    active: "30m",
    date: "Now",
    unread: false,
    archive: false,
    delivered: true,
    convo: [
      {
        id: "chat_1",
        chat: ["Hello!", "I found an issues when try to purchase the product."],
        date: "29 Apr, 2020 4:28 PM",
      },
      {
        id: "chat_2",
        me: true,
        chat: ["Thanks for inform. We just solved the issues. Please check now."],
        date: "29 Apr, 2020 4:12 PM",
      },
      {
        id: "chat_3",
        chat: ["This is really cool.", "It’s perfect. Thanks for letting me know."],
        date: "29 Apr, 2020 4:28 PM",
      },
      {
        meta: {
          metaID: "meta_1",
          metaText: "12 May, 2020",
        },
      },
      {
        id: "chat_4",
        chat: ["Hey, I am facing problem as i can not login into application. Can you help me to reset my password?"],
        date: "3:49 PM",
      },
      {
        id: "chat_5",
        me: true,
        date: "3:55 PM",
        chat: ["Definately. We are happy to help you."],
      },
      {
        id: "chat_6",
        date: "3:55 PM",
        chat: ["Thank you! Let me know when it done."],
      },
      {
        id: "chat_7",
        date: "3:55 PM",
        me: true,
        now: true,
        chat: [
          "We just reset your account. Please check your email for verification.",
          "Please confirm if your got email",
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Request 2",
    nickname: "",
    theme: "blue",
    chatTheme: "purple",
    date: "4.39 Am",
    active: "60m",
    unread: true,
    archive: false,
    fav: true,
    delivered: true,
    convo: [
      {
        id: "chat_1",
        chat: ["Hi I am Ishtiak, can you help me with something?"],
        date: "4:49 AM",
      },
      {
        id: "chat_2",
        me: true,
        chat: ["Thanks for inform. We just solved the issues. Please check now."],
        date: "4:12 PM",
      },
      {
        id: "chat_3",
        chat: ["This is really cool.", "It’s perfect. Thanks for letting me know."],
        date: "4:28 PM",
      },
    ],
  },
  {
    id: 3,
    name: "Request 3",
    nickname: "",
    chatTheme: "purple",
    fav: true,
    date: "6 Apr",
    unread: false,
    archive: false,
    active: true,
    delivered: true,
    convo: [
      {
        id: "chat_1",
        chat: ["Have you seens the claim from Rose?"],
        date: "6 Apr",
      },
      {
        id: "chat_3",
        me: true,
        chat: ["No I haven't. I will look into it", "It’s perfect. Thanks for letting me know."],
        date: "4:28 PM",
      },
    ],
  },

];

const sortedDataFunc = (array) => {
  chatData.sort(function (a, b) {
    return a.name === b.name ? 0 : a.name < b.name ? -1 : 1;
  });
  return chatData.filter((item) => array.includes(item.name.split("")[0].toUpperCase()) && !item.group);
};

const sortedDataNotFavFunc = (array) => {
  chatData.sort(function (a, b) {
    return a.name === b.name ? 0 : a.name < b.name ? -1 : 1;
  });
  return chatData.filter((item) => array.includes(item.name.split("")[0].toUpperCase()) && item.fav === false);
};

export const contacts = [
  {
    id: 1,
    title: "A",
    contacts: sortedDataFunc(["A"]),
  },
  {
    id: 2,
    title: "B",
    contacts: sortedDataFunc(["B"]),
  },
  {
    id: 3,
    title: "C",
    contacts: sortedDataFunc(["C"]),
  },
  {
    id: 3,
    title: "D",
    contacts: sortedDataFunc(["D"]),
  },
  {
    id: 4,
    title: "E-k",
    contacts: sortedDataFunc(["E", "F", "G", "H", "I", "J", "K"]),
  },
  {
    id: 5,
    title: "L-T",
    contacts: sortedDataFunc(["L", "M", "N", "O", "P", "Q", "R", "S", "T"]),
  },
  {
    id: 6,
    title: "U-Z",
    contacts: sortedDataFunc(["U", "V", "W", "X", "Y", "Z"]),
  },
];

export const addUserData = [
  {
    id: 50,
    role: "User",
    name: "Alissa Kate",
    theme: "purple",
  },
  {
    id: 51,
    role: "User",
    name: "Jasper Jordan",
    theme: "orange",
  },
  {
    id: 52,
    role: "User",
    name: "Winter Rays",
    theme: "pink",
  },
];

export const nonFavContacts = [
  {
    id: 1,
    title: "A",
    contacts: sortedDataNotFavFunc(["A"]),
  },
  {
    id: 2,
    title: "B",
    contacts: sortedDataNotFavFunc(["B"]),
  },
  {
    id: 3,
    title: "C",
    contacts: sortedDataNotFavFunc(["C"]),
  },
  {
    id: 3,
    title: "D",
    contacts: sortedDataNotFavFunc(["D"]),
  },
  {
    id: 4,
    title: "E-k",
    contacts: sortedDataNotFavFunc(["E", "F", "G", "H", "I", "J", "K"]),
  },
  {
    id: 5,
    title: "L-T",
    contacts: sortedDataNotFavFunc(["L", "M", "N", "O", "P", "Q", "R", "S", "T"]),
  },
  {
    id: 6,
    title: "U-Z",
    contacts: sortedDataNotFavFunc(["U", "V", "W", "X", "Y", "Z"]),
  },
];
