import { ReactNode } from "react"
import { styled } from "../stitches.config"
import { NewsItem, User } from "../types"
import { Avatar, AvatarGroup } from "./Avatar"
import { BoldedList } from "./BoldedList"
import { PolicyCard } from "./PolicyCard"

const Timestamp = styled('div', {
  color: "#666",
  fontSize: "14px",
})

const Span = styled('span')

function NewsItemHeader({ users }: { users: User[] }) {
  return <div>
    <AvatarGroup>
      {users.map(({ name, img }) => <Avatar fallback="UG" key={name} src={img} alt={name} />)}
    </AvatarGroup>
  </div>
}

const NewsLine = styled('div', {
  fontSize: "14px",
})

function NewsItemEventLine({ users, children }: { users: User[], children: ReactNode }) {
  return <NewsLine>
    <Span css={{ textTransform: 'uppercase', fontWeight: "600", marginRight: "4px" }}>
      {users.map(u => u.name).join(', ')}
    </Span>
    {children}
  </NewsLine>
}

export function PolicyNewsItem({ item, id, leftButton, }: {
  item: NewsItem,
  id?: string,
  leftButton?: ReactNode,
}) {
  const users = item.events.flatMap(e => e.users)
  return (
    <div>
      <NewsItemHeader users={users} />
      <PolicyCard policy={item.policy} id={id} leftButton={leftButton} />
      {item.events.map(e => (
        <NewsItemEventLine users={e.users}>
          {e.eventType === 'feeling' ?
            <>felt <BoldedList words={e.feelings} /></>
            : "UNKNOWN EVENT TYPE"}
        </NewsItemEventLine>
      ))}
      <Timestamp>{item.events[0].date}</Timestamp>
    </div>
  )
}
