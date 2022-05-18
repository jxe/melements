import { CameraIcon, CheckIcon, ChevronRightIcon, Cross1Icon, HamburgerMenuIcon, PlusIcon } from '@radix-ui/react-icons';
import React, { ReactNode, useEffect, useState } from 'react';
import { attendables as attendablesOptions } from "../attendables";
import { DropdownMenu, DropdownMenuArrow, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItemIndicator, DropdownMenuTrigger } from './Dropdown';
import { isWhat } from '../emotions';
import { styled } from "../stitches.config";
import { Appreciation, Location, Policy, Value } from "../types";
import { wobs as wobOptions } from "../wobs";
import { Badge } from './Badge';
import { BoldedList } from "./BoldedList";
import { Button } from './Button';
import { Checkbox, CheckboxLabel } from "./Checkbox";
import { EmotionSelect } from "./EmotionSelect";
import { GeolocationAccessory } from "./GeolocationAccessory";
import { IconButton } from "./IconButton";
import { cloudify } from "./ImageUploadButton";
import * as Multipane from "./Multipane";
import { PaneBody } from "./Multipane";
import { Attendable, PolicyCard, SectionHeader, Tags, Top, VCard } from "./PolicyCard";
import { TabbedDrawerMultiselect } from "./TabbedDrawerMultiselect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';
import { AnnotatedTagsField, TagsField } from "./TagsFields";
import { SheetedField } from './SheetedField';



type PaneId = 'garden' | 'attendables' | 'wobs';

const Hint = styled("div", {
  fontSize: "$3",
  color: "$gray11",
  padding: "8px 16px 0px",
})

function CellButton({ children, onClick }: { children: ReactNode, onClick: () => void }) {
  return (
    <Button cell onClick={onClick}>
      <span style={{ flex: "auto" }}>{children}</span>
      <ChevronRightIcon />
    </Button>
  )
}

function OnlyLifeGetsCard({ lifeGets, setActivePane }: {
  lifeGets: string[]
  setActivePane: (pane: PaneId) => void
}) {
  return <VCard css={{ maxWidth: 300, margin: "16px auto" }}>
    <SectionHeader> Things get </SectionHeader>
    <Tags onClick={() => setActivePane('wobs')}>
      {lifeGets.map(t => <Badge key={t} variant="lifeGets">{t}</Badge>)}
    </Tags>
  </VCard>
}

const TitleInput = styled('input', {
  padding: "8px", fontSize: "$2", border: "none", outline: "none",
  "&::placeholder": {
    textAlign: "center",
  },
  "&[disabled]": {
    cursor: "not-allowed",
    opacity: 0.5,
  },
})

function DraftCard({ lifeGets, qualitiesField, setName, name, followablesField, titleEnabled }: {
  name: string,
  setName: (name: string) => void,
  qualitiesField: ReactNode,
  followablesField: ReactNode,
  titleEnabled?: boolean,
  lifeGets: string[],
}) {
  return (
    <VCard css={{ maxWidth: 300, margin: "16px auto" }}>
      <Top>
        <div />
        <main>
          <TitleInput
            disabled={!titleEnabled}
            name="name"
            placeholder='Add a title'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </main>
        <div />
      </Top>
      <SectionHeader> Things get </SectionHeader>
      <section>
        {qualitiesField}
      </section>
      <SectionHeader> When I can follow </SectionHeader>
      <section>
        {followablesField}
        <PageHeading>
          Imagine you were able to be <BoldedList words={lifeGets} /> in this way—what would you be paying attention to?
        </PageHeading>
      </section>
    </VCard>
  );
}



function EditableTitleCard({ lookFor, lifeGets, setName, name, setActivePane }: {
  name: string,
  setName: (name: string) => void,
  lookFor: Policy['lookFor'],
  lifeGets: string[],
  setActivePane: (pane: PaneId) => void
}) {
  return (
    <VCard css={{ maxWidth: 300, margin: "16px auto" }}>
      <Top>
        <div />
        <main>
          <TitleInput
            name="name"
            placeholder='Add a title'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </main>
        <div />
      </Top>
      <SectionHeader> Things get </SectionHeader>
      <Tags onClick={() => setActivePane('wobs')}>
        {lifeGets.map(t => <Badge variant="lifeGets">{t}</Badge>)}
      </Tags>

      <SectionHeader> When I can follow </SectionHeader>
      <section onClick={() => setActivePane('attendables')}>
        {lookFor.map(a => (
          <Attendable key={a.terms[0]}>
            <Badge variant='lookFor'>{a.terms.join(", ")}</Badge>
            {a.qualifier}
          </Attendable>
        ))}
      </section>
    </VCard>
  );
}

function PickedValueGarden({ value, onDelete }: {
  value: Value,
  onDelete: () => void,
}) {
  return <div style={{ display: "flex", justifyContent: "start" }}>
    <PolicyCard size={300} policy={value} />
    <IconButton variant="ghost" onClick={onDelete}>
      <Cross1Icon />
    </IconButton>
  </div>
}

interface Topic {
  type: 'emotions' | 'spot'
  feelings: string[],
  image?: File,
  location?: Location,
}


function TopicSelector({ defaultTopic, onTopicChanged }: {
  defaultTopic: Topic,
  onTopicChanged: (topic: Topic) => void
}) {
  const [topic, setTopic] = useState<Topic>(defaultTopic)
  const [showEmotions, setShowEmotions] = useState(false)
  function setFeelings(feelings: string[]) {
    setTopic(topic => ({ ...topic, feelings }))
  }
  function setLocation(location: Location) {
    setTopic(topic => ({ ...topic, location }))
  }
  function setImage(image: File) {
    setTopic(topic => ({ ...topic, image }))
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
    <Tabs
      value={topic.type}
      onValueChange={(type) => setTopic({ ...topic, type: type as Topic['type'] })}
    >
      <TabsList>
        <TabsTrigger value='emotions'>Emotions</TabsTrigger>
        <TabsTrigger value='spot'>Spot</TabsTrigger>
      </TabsList>
      <TabsContent value='emotions' css={{ padding: "8px" }}>
        {emotionSelect}
      </TabsContent>
      <TabsContent value='spot'>
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
      </TabsContent>
    </Tabs>
  )
}

export function Appreciator({ onSave, relatedValues, onQueryChanged, onCancel }: {
  onSave: (result: Appreciation) => void
  relatedValues: Value[]
  onQueryChanged?: ({ lifeGets }: { lifeGets: string[] }) => void
  onCancel: () => void
}) {
  const [activePane, setActivePane] = useState<PaneId>('garden');
  const [topic, setTopic] = useState<Topic>({ type: 'emotions', feelings: [] })

  // value stuff
  const [value, setValue] = useState<Value>()
  const [name, setName] = useState('')
  const [draft, setDraft] = useState<{ [what: string]: { lifeGets: string[] } }>({})
  const lifeGets = Object.values(draft).reduce((prev, curr) => prev.concat(curr.lifeGets), [] as string[])
  const [annotations, setAnnotations] = useState<{
    [tag: string]: string
  }>({});
  const lookFors = Object.keys(annotations).map(tag => ({
    terms: [tag],
    qualifier: annotations[tag]
  }))


  const isReady = topic.type !== 'spot' || topic.location
  const hasValue = value || (name && lookFors.length > 0 && lifeGets.length > 0)
  const canPost = hasValue && isReady

  useEffect(() => {
    onQueryChanged && onQueryChanged({ lifeGets })
  }, [draft])

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

  const valuePrompt = (topic.type === 'emotions') ? <div style={{ textAlign: "center", paddingTop: "16px" }}>
    What's your <BoldedList words={topic.feelings} /> feeling telling you? <br /> What value is <BoldedList or words={isWhat(topic.feelings)} />?
  </div> : <div style={{ textAlign: "center", paddingTop: "16px" }}>
    I'm experiencing the following appreciation
  </div>

  const relatedPrompt = (topic.type === 'emotions') ? <>What's <BoldedList or words={isWhat(topic.feelings)} />?</> : <>What are you appreciating?</>

  return (
    <Multipane.Root active={'garden'}>
      <Multipane.Pane id="garden">
        <Multipane.Top
          lButton={
            <IconButton variant="ghost" onClick={onCancel}>
              <Cross1Icon />
            </IconButton>
          }
          rButton={
            <Button onClick={onPost} disabled={!canPost}>
              Post
            </Button>
          }
        >Appreciate!</Multipane.Top>

        <TopicSelector defaultTopic={topic} onTopicChanged={setTopic} />

        {(topic.type !== 'emotions' || topic.feelings.length > 0) &&

          <Multipane.PaneBody>
            {valuePrompt}
            {(
              value
                ? <PickedValueGarden value={value} onDelete={() => setValue(undefined)} />
                : <DraftCard
                  lifeGets={lifeGets}
                  qualitiesField={
                    <Confugurator css={{ flex: "auto" }}>
                      <Unit
                        what="connection"
                        topic={topic}
                        options={wobOptions.connected}
                        onChange={(connection) => setDraft({ ...draft, connection })}
                      />

                      <Unit
                        what="exploration"
                        topic={topic}
                        options={wobOptions.exploring}
                        onChange={(exploration) => setDraft({ ...draft, exploration })}
                      />

                      <Unit
                        what="strength"
                        topic={topic}
                        options={wobOptions.strong}
                        onChange={(strength) => setDraft({ ...draft, strength })}
                      />
                    </Confugurator>
                  } followablesField={
                    <AttendablesField
                      disabled={lifeGets.length === 0}
                      annotations={annotations}
                      setAnnotations={setAnnotations}
                    />
                  }
                  name={name} setName={setName}
                  titleEnabled={lookFors.length > 0}
                />
            )}
            {!value && relatedValues.length > 0 && <PageHeading>
              Or choose a related value.
            </PageHeading>}
          </Multipane.PaneBody>
        }
      </Multipane.Pane>
      <Multipane.Pane id="related">
        {relatedPrompt}
        <Stack>
          {relatedValues.map(value => (
            <PolicyCard size={300} policy={value} onClick={() => {
              setValue(value);
              setActivePane('garden');
            }} />
          ))}
        </Stack>
      </Multipane.Pane>
    </Multipane.Root>
  )
}

const PageHeading = styled("div", {
  textAlign: "center",
  padding: "16px 8px",
})

const Confugurator = styled("div", {
  backgroundColor: "#ddd",
})

const ConfiguratorHeader = styled("div", {
  padding: "4px 16px",
  textTransform: "uppercase",
  color: "$gray11",
  fontSize: "$2",
})

const ConfiguratorGroupBody = styled("div", {
  backgroundColor: "white",
  padding: "8px",
  borderRadius: "$4",
  margin: "0px 8px",
  display: "grid",
  gap: "0.5px",
  "& > :not(:last-child)": {
    borderBottom: "0.5px solid $gray11",
  }
})

//
/// VALUE GARDENS
//

function ConfiguratorGroup({ title, hint, children }: {
  title: string,
  children: ReactNode,
  hint?: ReactNode,
}) {
  return <ConfiguratorGroupDiv>
    <ConfiguratorHeader>{title}</ConfiguratorHeader>
    <ConfiguratorGroupBody>
      {children}
    </ConfiguratorGroupBody>
    {hint && <Hint>{hint}</Hint>}
  </ConfiguratorGroupDiv>
}

const ConfiguratorGroupDiv = styled('div', {
  paddingTop: "16px",
  paddingBottom: "16px",
})

function WobPrompt({ topic }: { topic: Topic }) {
  if (topic.type === 'emotions') return <>
    is <BoldedList or words={isWhat(topic.feelings)} />
  </>
  else return <>
    is present
  </>
}

function Unit({ what, topic, options, onChange }: {
  what: string,
  topic: Topic,
  options: string[],
  onChange: ({ lifeGets }: {
    lifeGets: string[],
  }) => void
}) {
  const [open, setOpen] = useState<boolean>(false)
  const [lifeGets, setLifeGets] = useState<string[]>([]);
  const gets = {
    "strength": "strong",
    "connection": "connected",
    "exploration": "exploratory",
  }[what]!
  const allGets = [gets, ...lifeGets]
  function openUp() {
    setOpen(true)
    onChange({ lifeGets: allGets })
  }
  function close() {
    setOpen(false)
    onChange({ lifeGets: [] })
  }

  return <ConfiguratorGroup title={what}>
    <CheckboxLabel flush htmlFor={what}>
      <Checkbox id={what} checked={open} onCheckedChange={(b) => b ? openUp() : close()} />
      <div>
        {/* I am <BoldedList words={feelings} /> because a */}
        A kind of <b>{what}</b> <WobPrompt topic={topic} />.
      </div>
    </CheckboxLabel>

    {open && <div>
      <TabbedDrawerMultiselect
        options={{ all: options }}
        selected={lifeGets}
        setSelected={x => { setLifeGets(x); onChange({ lifeGets: [gets, ...x] }) }}
      >
        <TagsField
          tagVariant='lifeGets'
          placeholder="Which kind?"
          tags={lifeGets}
        />
      </TabbedDrawerMultiselect>
    </div>}
  </ConfiguratorGroup>
}

const Stack = styled('div', {
  display: "grid", gap: "32px"
})


//
// VALUE CONFIGURATORS
//

export function AttendablesField({ annotations, setAnnotations, disabled }: {
  disabled?: boolean,
  annotations: {
    [tag: string]: string
  },
  setAnnotations: (annotations: {
    [tag: string]: string
  }) => void,
}) {
  function setAnnotation(tag: string, annotation: string) {
    setAnnotations({
      ...annotations,
      [tag]: annotation,
    });
  }
  const [lookFor, setLookFor] = useState<string[]>([]);

  return <SheetedField
    sheetContent={
      attendablesOptions.map(({ tag, label }) => (
        <div key={tag}>
          <CheckboxLabel flush htmlFor={tag}>
            <Checkbox id={tag} checked={lookFor.includes(tag)} onCheckedChange={(b) => {
              if (b) {
                setLookFor([...lookFor, tag]);
              } else {
                setLookFor(lookFor.filter(x => x !== tag));
              }
            }} />
            <div>
              <b>{label}</b>
            </div>
          </CheckboxLabel>
        </div>
      ))
    }
  >
    <AnnotatedTagsField
      disabled={disabled}
      tagVariant='lookFor'
      placeholder=""
      tags={lookFor}
      annotations={annotations}
      setAnnotation={setAnnotation}
      annotationPlaceholder="What kind?"
    />
  </SheetedField>
}
