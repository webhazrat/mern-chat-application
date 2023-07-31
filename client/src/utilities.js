export const scrollToLastMessage = (lastMessage) => {
  const lastElementChild = lastMessage.current?.lastElementChild;
  lastElementChild?.scrollIntoView({ behavior: "smooth" });
};
