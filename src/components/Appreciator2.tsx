import { CameraIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, Cross1Icon, EyeOpenIcon, HamburgerMenuIcon, PlusIcon, TriangleUpIcon } from '@radix-ui/react-icons';
import React, { ReactNode, useEffect, useState } from 'react';
import { DropdownMenu, DropdownMenuArrow, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItemIndicator, DropdownMenuTrigger } from './Dropdown';
import { isWhat } from '../emotions';
import { styled } from "../stitches.config";
import { Appreciation, Location, Value, valueDraftToPolicy, ValueDraft } from "../types";
import { BoldedList } from "./BoldedList";
import { Button } from './Button';
import { EmotionSelect } from "./EmotionSelect";
import { GeolocationAccessory } from "./GeolocationAccessory";
import { IconButton } from "./IconButton";
import { cloudify } from "./ImageUploadButton";
import * as Multipane from "./Multipane";
import { PolicyCard } from "./PolicyCard";
import { Select, SelectContent, SelectIcon, SelectItem, SelectTrigger, SelectValue } from './Select';
import { DraftPolicyCard, Topic } from './DraftPolicyCard';

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

  // value draft stuff
  const [valueDraftTip, setValueDraftTip] = useState<ReactNode>()
  const [valueDraft, setValueDraft] = useState<ValueDraft>({
    name: '',
    annotations: {},
    lifeGets: [],
  })
  const lookFors = Object.keys(valueDraft.annotations).map(tag => ({
    terms: [tag],
    qualifier: valueDraft.annotations[tag]
  }))

  const isReady = topic.type !== 'spot' || topic.location
  const hasValue = value || (valueDraft.name && lookFors.length > 0 && valueDraft.lifeGets.length > 0)
  const canPost = hasValue && isReady

  useEffect(() => {
    onQueryChanged && onQueryChanged({ lifeGets: valueDraft.lifeGets })
  }, [valueDraft.lifeGets])

  async function onPost() {
    const imageUrl = topic.image && await cloudify(topic.image) || undefined
    if (!canPost) return
    onSave({
      feelings: topic.feelings,
      value: value || valueDraftToPolicy(valueDraft),
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
                  : <DraftPolicyCard
                    brNode={
                      (!value && relatedValues.length > 0) && <Button link onClick={() => setActivePane('related')}>
                        {relatedValues.length} related {relatedValues.length === 1 ? 'value' : 'values'} &raquo;
                      </Button>
                    }
                    topic={topic}
                    valueDraftChanged={setValueDraft}
                    updateTip={setValueDraftTip}
                  />
              )}
            </Multipane.PaneBody>
            {value ? null : valueDraftTip}
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
        <Multipane.PaneBody css={{ padding: "8px" }}>
          {relatedPrompt}
          <Stack>
            {relatedValues.map(value => (
              <PolicyCard size={300} policy={value} onClick={() => {
                setValue(value);
                setActivePane('garden');
              }} />
            ))}
          </Stack>
        </Multipane.PaneBody>
      </Multipane.Pane>
    </Multipane.Root>
  )
}

const Stack = styled('div', {
  display: "grid", gap: "32px"
})
