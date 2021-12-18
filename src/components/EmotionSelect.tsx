export default null

// import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
// import styles from './EmotionSelect.module.css';
// import { ChevronRightIcon } from '@radix-ui/react-icons';
// import { feels } from '../feels';


// function Item({ children }: { children: React.ReactNode; }) {
//   return (
//     <DropdownMenu.Item className={styles.EmotionSelectItem}>{children}</DropdownMenu.Item>
//   );
// }

// function Content({ children }: { children: React.ReactNode; }) {
//   return (
//     <DropdownMenu.Content className={styles.EmotionSelectContent}>{children}</DropdownMenu.Content>
//   );
// }

// function R({ children }: { children: React.ReactNode }) {
//   return <div className={styles.R}>{children}</div>
// }

// function Submenu({ name, entries }: { name: string, entries: string[] }) {
//   return (
//     <DropdownMenu.Root>
//       <DropdownMenu.TriggerItem className={styles.EmotionSelectItem}>
//         {name}
//         <R><ChevronRightIcon /></R>
//       </DropdownMenu.TriggerItem>
//       <Content>
//         {entries.map((entry, i) => (
//           <Item key={i}> {entry} </Item>
//         ))}
//       </Content>
//     </DropdownMenu.Root>
//   );
// }

// export function EmotionSelect({ }) {
//   return <DropdownMenu.Root>
//     <DropdownMenu.Trigger>Choose an emotion</DropdownMenu.Trigger>
//     <Content>
//       <DropdownMenu.Label className={styles.DropdownLabel}>Negative</DropdownMenu.Label>
//       <Submenu name="Anger" entries={feels.negative.angry} />
//       <Submenu name="Fear" entries={feels.negative.afraid} />
//       <Submenu name="Confusion" entries={feels.negative.confused} />
//       <Submenu name="Hopelessness" entries={feels.negative.hopeless} />
//       <Submenu name="Numbness" entries={feels.negative.numb} />
//       <Submenu name="Sadness" entries={feels.negative.sad} />
//       <Submenu name="Shame" entries={feels.negative.ashamed} />
//       <DropdownMenu.Separator className={styles.DropdownSeparator} />
//       <DropdownMenu.Label className={styles.DropdownLabel}>Positive</DropdownMenu.Label>
//       <DropdownMenu.Arrow className={styles.Arrow} />
//     </Content>
//   </DropdownMenu.Root>
// }
