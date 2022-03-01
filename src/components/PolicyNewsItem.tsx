interface NewsEvent {
  user: User,
  news: ReactNode
}

const Timestamp = styled('div', {
  color: "#666"
})

const Span = styled('span')

function NewsItemHeader({ users }: { users: User[] }) {
  return <div>
    <AvatarGroup>
      {users.map(({ name, img }) => <Avatar key={name} src={img} alt={name} />)}
    </AvatarGroup>
  </div>
}

function NewsItemEventLine({ user, children }: { user: User, children: ReactNode }) {
  return <div>
    <Span css={{ textTransform: 'uppercase' }}>
      {user.name}
    </Span>
    {children}
  </div>
}

export function PolicyNewsItem({
  policy,
  id,
  leftButton,
  users,
  timestamp,
  events
}: {
  policy: Policy,
  id?: string,
  leftButton?: ReactNode,
  users: User[],
  timestamp: ReactNode,
  events: NewsEvent[]
}) {
  return (
    <div>
      <NewsItemHeader users={users} />
      <PolicyCard policy={policy} id={id} leftButton={leftButton} />
      {events.map(e => <NewsItemEventLine user={e.user}>{e.news}</NewsItemEventLine>)}
      <Timestamp>{timestamp}</Timestamp>
    </div>
  )
}
