import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

export function TabbedDrawer({ tabs, renderContentForTab }: {
  tabs: string[],
  renderContentForTab: (tab: string) => JSX.Element,
}) {
  if (tabs.length === 1) {
    return renderContentForTab(tabs[0]);
  }
  return (
    <Tabs css={{ display: "flex", flexDirection: "column", position: "absolute", inset: 0 }}>
      <TabsList>
        {tabs.map(tab => (
          <TabsTrigger key={tab as string} value={tab as string}>{tab}</TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(tab => (
        <TabsContent key={tab as string} css={{ overflowY: "auto" }} value={tab as string}>
          {renderContentForTab(tab)}
        </TabsContent>
      ))}
    </Tabs>
  )
}
