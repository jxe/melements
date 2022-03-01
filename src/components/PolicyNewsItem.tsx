import { ReactNode } from "react"
import { isWhat } from "../emotions"
import { styled } from "../stitches.config"
import { NewsItem, User } from "../types"
import { Avatar, AvatarGroup } from "./Avatar"
import { BoldedList } from "./BoldedList"
import { PolicyCard } from "./PolicyCard"

const Timestamp = styled('div', {
  color: "$gray10",
  fontSize: "12px",
})

const Span = styled('span')

const HeaderLine = styled('div', {
  my: "2px"
})

function NewsItemHeader({ users }: { users: User[] }) {
  if (!users.length) return null
  return <HeaderLine>
    <AvatarGroup>
      {users.map(({ name, img }) => <Avatar fallback={name[0]} key={name} src={img} alt={name} />)}
    </AvatarGroup>
  </HeaderLine>
}

const NewsLine = styled('div', {
  fontSize: "14px",
  color: "$gray11",
  margin: "$1 0px"
})

function NewsItemEventLine({ users, children }: { users: User[], children: ReactNode }) {
  return <NewsLine>
    <Span css={{ textTransform: 'uppercase', fontWeight: "800", marginRight: "4px", fontSize: "12px" }}>
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
            <>&mdash; <BoldedList words={e.feelings} /> because this source of meaning was <BoldedList conjunction="or" words={isWhat(e.feelings)} />
            </>
            : "UNKNOWN EVENT TYPE"}
        </NewsItemEventLine>
      ))}
      <Timestamp>{item.events[0].date}</Timestamp>
    </div>
  )
}
