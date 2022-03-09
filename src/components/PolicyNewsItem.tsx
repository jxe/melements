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
  my: "4px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  "& b": {
    fontWeight: "500",
  }
})

function NewsItemHeader({ users }: { users: User[] }) {
  if (!users.length) return null
  return <HeaderLine>
    <AvatarGroup>
      {users.map(({ name, img }) => <Avatar fallback={name[0]} key={name} src={img} alt={name} />)}
    </AvatarGroup>
    <BoldedList words={users.map(u => u.name)} />
  </HeaderLine>
}

const NewsLine = styled('div', {
  fontSize: "14px",
  color: "$gray11",
  margin: "$1 0px"
})

function NewsItemEventLine({ users, children }: { users: User[], children: ReactNode }) {
  return <NewsLine>
    <Span css={{ textTransform: 'uppercase', fontWeight: "800", marginRight: "4px", fontSize: "11px" }}>
      {users.map(u => u.name).join(', ')}
    </Span>
    {children}
  </NewsLine>
}

// in miliseconds
const units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: 24 * 60 * 60 * 1000 * 365 / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000
}

var rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
function getRelativeTime(d1: Date, d2 = new Date()) {
  var elapsed = d1.getTime() - d2.getTime()
  for (const [u, ms] of Object.entries(units)) {
    if (Math.abs(elapsed) > ms || u == 'second')
      return rtf.format(Math.round(elapsed / ms), u as Intl.RelativeTimeFormatUnit)
  }
}

export function PolicyNewsItem({ item, id, leftButton, }: {
  item: NewsItem,
  id?: string,
  leftButton?: ReactNode,
}) {
  const users = item.events.flatMap(e => e.users)
  return (
    <div style={{ width: "300px" }}>
      <NewsItemHeader users={users} />
      <PolicyCard size={300} policy={item.policy} id={id} leftButton={leftButton} />
      {item.events.map(e => (
        <NewsItemEventLine users={e.users}>
          {e.eventType === 'feeling' ?
            <>&mdash; <BoldedList words={e.feelings} /> because this source of meaning was <BoldedList or words={isWhat(e.feelings)} />
            </>
            : "UNKNOWN EVENT TYPE"}
        </NewsItemEventLine>
      ))}
      {item.events[0] && <Timestamp>{getRelativeTime(item.events[0].date)}</Timestamp>}
    </div>
  )
}
