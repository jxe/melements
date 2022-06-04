import { CameraIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, Cross1Icon, EyeOpenIcon, HamburgerMenuIcon, PlusIcon, TriangleUpIcon } from '@radix-ui/react-icons';
import React, { ReactNode, useEffect, useState } from 'react';
import { DropdownMenu, DropdownMenuArrow, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItemIndicator, DropdownMenuTrigger } from './Dropdown';
import { areNegative, isWhat } from '../emotions';
import { styled } from "../stitches.config";
import { Appreciation, Location, Policy, Value } from "../types";
import { BoldedList } from "./BoldedList";
import { Button } from './Button';
import { EmotionSelect } from "./EmotionSelect";
import { GeolocationAccessory } from "./GeolocationAccessory";
import { IconButton } from "./IconButton";
import { cloudify } from "./ImageUploadButton";
import * as Multipane from "./Multipane";
import { PolicyCard, SectionHeader, Top, VCard } from "./PolicyCard";
import { Select, SelectContent, SelectIcon, SelectItem, SelectTrigger, SelectValue } from './Select';
import { POASelect } from './POASelect';
import { QualitiesSelect } from './QualitiesSelect';

type PaneId = 'garden' | 'attendables' | 'wobs';

function ExpandableVCard({ children, brNode }: { children: ReactNode, brNode?: ReactNode }) {
  return <VCard css={{
    marginBottom: brNode ? '32px' : undefined,
    width: 300, marginTop: "16px", marginLeft: "auto", marginRight: "auto"
  }}>
    {children}
    {brNode && <div style={{ position: "absolute", bottom: "-20px", right: 0 }}>
      {brNode}
    </div>}
  </VCard>
}

const Dot = styled("span", {
  width: "8px",
  height: "8px",
  borderRadius: "4px",
  backgroundColor: "var(--blue-text)",
  display: "inline-block",
  variants: {
    marginalia: {
      true: {
        position: "absolute",
        left: "-18px",
        marginTop: "14px",
      }
    }
  }
})

const TitleInput = styled('input', {
  padding: "8px",
  fontSize: "$4",
  border: "none",
  outline: "none",
  textAlign: "center",
  maxWidth: "210px",
  "&::placeholder": {
    textAlign: "center",
  },
  "&[disabled]": {
    cursor: "not-allowed",
    opacity: 0.5,
  },
})

function DraftCard({ qualitiesField, setName, name, followablesField, next, valence, brNode }: {
  name: string,
  setName: (name: string) => void,
  qualitiesField: ReactNode,
  followablesField: ReactNode,
  next: 'qualities' | 'attendables' | 'title' | null
  valence: "present" | "absent",
  brNode?: ReactNode
}) {
  return (
    <ExpandableVCard brNode={brNode}>
      {(next === 'title' || !next) &&
        <Top>
          <div />
          <main>
            {next === 'title' && <Dot marginalia />}
            <TitleInput
              name="name"
              placeholder='Add a title'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </main>
          <div />
        </Top>
      }
      <SectionHeader> {valence === 'present' ? "Things are" : "If only things would be"} </SectionHeader>
      <section>
        {next === 'qualities' && <Dot marginalia />}
        {qualitiesField}
      </section>
      <SectionHeader> {valence === 'present' ? "because I am following" : "and if I could follow"} </SectionHeader>
      <section>
        {next === 'attendables' && <Dot marginalia />}
        {followablesField}
      </section>
    </ExpandableVCard>
  );
}

const TipBox = styled("div", {
  color: "var(--blue-text)",
  background: "$blue3",
  padding: "16px",
  display: "flex",
  gap: "8px",
  borderTop: "solid 0.25px $blueTextRelaxed"
})

function TipContainer({ header, children }: { header: ReactNode, children?: ReactNode }) {
  return <TipBox>
    <Dot css={{ flexShrink: 0, marginTop: "6px" }} />
    <div>
      <span style={{ fontWeight: 600 }}>
        {header}
      </span> &mdash; {children}
    </div>
  </TipBox>
}

function Tip({ type, valence, lifeGets, topic }: {
  type: 'title' | 'qualities' | 'attendables' | null,
  valence: "present" | "absent",
  lifeGets: string[]
  topic: Topic
}) {
  if (type === 'title') {
    return <TipContainer header={<>Finally, add a title.</>} />
  } else if (type === 'qualities') {
    if (topic.type === "spot") {
      return <TipContainer header={<> Add qualities</>}> What way of living are you experiencing?</TipContainer>
    } else {
      return <TipContainer header={<> Add qualities</>}>{valence === 'absent' ? "How do you wish you were living?" : "What's going well?"} What value is <BoldedList or words={isWhat(topic.feelings)} />?</TipContainer>
    }

  } else if (type === 'attendables') {
    return <TipContainer header={<>Add paths of attention</>}> {valence === 'present' ? "When you are" : "Imagine you were able to be"} <BoldedList words={lifeGets} /> in this way—what {valence === 'present' ? 'are you' : "would you be"} paying attention to?
    </TipContainer>
  } else {
    return null
  }
}

function PickedValueGarden({ value, onDelete }: {
  value: Value,
  onDelete: () => void,
}) {
  return <div style={{
    maxWidth: "340px",
    margin: "0px auto",
    display: "flex",
    justifyContent: "start"
  }}>
    <PolicyCard size={300} policy={value} />
    <IconButton variant="ghost" onClick={onDelete}>
      <Cross1Icon />
    </IconButton>
  </div>
}

export interface Topic {
  type: 'emotions' | 'spot'
  feelings: string[],
  image?: File,
  location?: Location,
}


function TopicSelector({ topic, onTopicChanged }: {
  topic: Topic,
  onTopicChanged: any
}) {
  const [showEmotions, setShowEmotions] = useState(false)
  function setFeelings(feelings: string[]) {
    onTopicChanged((topic: any) => ({ ...topic, feelings }))
  }
  function setLocation(location: Location) {
    onTopicChanged((topic: any) => ({ ...topic, location }))
  }
  function setImage(image: File) {
    onTopicChanged((topic: any) => ({ ...topic, image }))
  }

  const spotAddMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton aria-label="Customise options">
          <HamburgerMenuIcon />
        </IconButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={5}>
        <DropdownMenuCheckboxItem
          checked={showEmotions}
          onCheckedChange={setShowEmotions}
        >
          <DropdownMenuItemIndicator>
            <CheckIcon />
          </DropdownMenuItemIndicator>
          Add emotions
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={topic.image !== undefined}
        // onCheckedChange={setShowPhoto}
        >
          <DropdownMenuItemIndicator>
            <CheckIcon />
          </DropdownMenuItemIndicator>
          <label htmlFor="imageUpload">
            Add photo
          </label>
        </DropdownMenuCheckboxItem>
        <DropdownMenuArrow offset={12} />
      </DropdownMenuContent>
    </DropdownMenu>

  )


  useEffect(() => {
    onTopicChanged(topic)
  }, [topic])

  const emotionSelect = <EmotionSelect
    css={{ flex: "auto" }}
    variant='inset'
    feelings={topic.feelings}
    onFeelingsChanged={setFeelings}
  />

  return (
    <>
      {
        // <Tabs
        //   value={topic.type}
        //   onValueChange={(type) => setTopic({ ...topic, type: type as Topic['type'] })}
        // >
        //   <TabsList>
        //     <TabsTrigger value='emotions'>Emotions</TabsTrigger>
        //     <TabsTrigger value='spot'>Spot</TabsTrigger>
        //   </TabsList>
        topic.type === 'emotions' && (
          <div style={{ padding: "8px" }}>
            {emotionSelect}
          </div>
        )
      }
      {
        topic.type === 'spot' && (
          <>
            <div style={{ display: "flex", background: "#eee" }}>
              <GeolocationAccessory onCoordsChange={setLocation} />
              {topic.image &&
                <img
                  width={100}
                  src={URL.createObjectURL(topic.image)}
                />
              }
              {spotAddMenu}
            </div>
            {showEmotions && (
              <div style={{ display: "flex", padding: "8px" }}>
                {emotionSelect}
              </div>
            )}
            <input
              id="imageUpload"
              style={{ display: "none" }}
              accept="image/*"
              type="file"
              onChange={(e) => setImage(e.target.files?.item(0)!)}
            />
          </>
        )
      }
    </>
  )
}

interface Annotations {
  [tag: string]: string
}

const Bubble = styled('div', {
  margin: "6px 16px 8px",
  padding: "8px 10px",
  position: "relative",
  borderRadius: "4px",
  backgroundColor: "$goldHighlightRelaxed",
})

const BubbleNose = styled(TriangleUpIcon, {
  color: "$goldHighlightRelaxed",
  position: "absolute",
  top: -18, left: 0,
  width: 30, height: 30,
})

export function Appreciator({ onSave, relatedValues, onQueryChanged, onCancel }: {
  onSave: (result: Appreciation) => void
  relatedValues: Value[]
  onQueryChanged?: ({ lifeGets }: { lifeGets: string[] }) => void
  onCancel: () => void
}) {
  const [activePane, setActivePane] = useState('garden')
  const [topic, setTopic] = useState<Topic>({ type: 'emotions', feelings: [] })

  // value stuff
  const [value, setValue] = useState<Value>()
  const [name, setName] = useState('')
  const [lifeGets, setLifeGets] = useState<string[]>([])
  const [annotations, setAnnotations] = useState<Annotations>({});
  const lookFors = Object.keys(annotations).map(tag => ({
    terms: [tag],
    qualifier: annotations[tag]
  }))

  const isReady = topic.type !== 'spot' || topic.location
  const hasValue = value || (name && lookFors.length > 0 && lifeGets.length > 0)
  const canPost = hasValue && isReady

  useEffect(() => {
    onQueryChanged && onQueryChanged({ lifeGets })
  }, [lifeGets])

  async function onPost() {
    const imageUrl = topic.image && await cloudify(topic.image) || undefined
    if (!canPost) return
    onSave({
      feelings: topic.feelings,
      value: value || {
        name,
        type: 'exploratory',
        lookFor: Object.keys(annotations).map(tag => ({
          terms: [tag],
          qualifier: annotations[tag]
        })),
        lifeGets,
      },
      location: topic.location,
      imageUrl,
    })
  }

  const valuePrompt = (topic.type === 'emotions') ? <Bubble>
    <BubbleNose />
    These feelings means something important for you is <BoldedList or words={isWhat(topic.feelings)} />... what could it be?
  </Bubble> : <div style={{ textAlign: "center", paddingTop: "16px" }}>
    I'm experiencing the following appreciation
  </div>

  const relatedPrompt = (topic.type === 'emotions') ? <>What's <BoldedList or words={isWhat(topic.feelings)} />?</> : <>What are you appreciating?</>

  const next =
    value
      ? null
      : Object.values(annotations).some(x => x)
        ? (name.length > 3 ? null : 'title')
        : (lifeGets.length > 1 ? 'attendables' : 'qualities')
  const valence = topic.type === 'spot' ? 'present' : areNegative(topic.feelings) ? 'absent' : 'present'

  return (
    <Multipane.Root active={activePane}>
      <Multipane.Pane id="garden">
        <Multipane.Top
          lButton={
            <IconButton tabIndex={-1} variant="ghost" onClick={onCancel}>
              <Cross1Icon />
            </IconButton>
          }
          rButton={
            <Button tabIndex={-1} onClick={onPost} disabled={!canPost}>
              Post
            </Button>
          }
        >

          <Select
            value={topic.type}
            onValueChange={(type) => setTopic({ ...topic, type: type as Topic['type'] })}
          >
            <SelectTrigger chill tabIndex={-1}>
              <SelectValue />
              <SelectIcon />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emotions">
                Finding a value in my emotions
              </SelectItem>
              <SelectItem value="spot">
                Logging an appreciation at this location
              </SelectItem>
            </SelectContent>
          </Select>

        </Multipane.Top>

        <TopicSelector topic={topic} onTopicChanged={setTopic} />

        {(topic.type !== 'emotions' || topic.feelings.length > 0) &&
          <>
            <Multipane.PaneBody>
              {valuePrompt}
              {(
                value
                  ? <PickedValueGarden value={value} onDelete={() => setValue(undefined)} />
                  : <DraftCard
                    brNode={
                      (!value && relatedValues.length > 0) && <Button link onClick={() => setActivePane('related')}>
                        {relatedValues.length} related {relatedValues.length === 1 ? 'value' : 'values'} &raquo;
                      </Button>
                    }
                    valence={valence}
                    qualitiesField={
                      <QualitiesSelect
                        topic={topic}
                        lifeGets={lifeGets}
                        setLifeGets={setLifeGets}
                      />
                    } followablesField={
                      <POASelect
                        disabled={lifeGets.length === 0}
                        annotations={annotations}
                        setAnnotations={setAnnotations}
                      />
                    }
                    name={name}
                    setName={setName}
                    next={next}
                  />
              )}
            </Multipane.PaneBody>
            <Tip
              type={next}
              valence={valence}
              lifeGets={lifeGets}
              topic={topic}
            />
          </>
        }
      </Multipane.Pane>
      <Multipane.Pane id="related">
        <Multipane.Top
          lButton={<IconButton variant="ghost" onClick={() => setActivePane('garden')}
          >
            <ChevronLeftIcon />
          </IconButton>}>
          Related Values
        </Multipane.Top>
        <div style={{ overflowY: "auto", padding: "8px" }}>
          {relatedPrompt}
          <Stack>
            {relatedValues.map(value => (
              <PolicyCard size={300} policy={value} onClick={() => {
                setValue(value);
                setActivePane('garden');
              }} />
            ))}
          </Stack>
        </div>
      </Multipane.Pane>
    </Multipane.Root>
  )
}

const Stack = styled('div', {
  display: "grid", gap: "32px"
})
