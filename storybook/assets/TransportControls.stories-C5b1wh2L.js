import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-Q1GcV6wX.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./CompactTransportControls-BXI7QbHK.js";import{n as a,t as o}from"./TransportControls-CTWsxdcq.js";var s,c,l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{s=t(),r(),a(),c=n(),{expect:l,fn:u}=__STORYBOOK_MODULE_TEST__,d={title:`Actions/Transport Controls`,component:o,tags:[`autodocs`]},f={tempo:84,onTempoChange:u(),loop:!0,onLoopChange:u(),muted:!1,onMutedChange:u(),isPlaying:!1,onTogglePlay:u(),onStop:u()},p={args:f,play:async({args:e,canvas:t,userEvent:n})=>{await n.click(t.getByRole(`button`,{name:/play/i})),await l(e.onTogglePlay).toHaveBeenCalledOnce(),await n.click(t.getByRole(`button`,{name:/stop/i})),await l(e.onStop).toHaveBeenCalledOnce(),await n.click(t.getByRole(`switch`,{name:/loop flow/i})),await l(e.onLoopChange).toHaveBeenCalledWith(!1),await n.click(t.getByRole(`button`,{name:`Mute`})),await l(e.onMutedChange).toHaveBeenCalledWith(!0)}},m={args:{...f,isPlaying:!0},play:async({canvas:e})=>{await l(e.getByRole(`button`,{name:/pause/i})).toBeInTheDocument()}},h={args:{...f,muted:void 0,onMutedChange:void 0}},g={render:function(e){let[t,n]=(0,s.useState)(e.tempo),[r,i]=(0,s.useState)(e.loop),[a,l]=(0,s.useState)(!1);return(0,c.jsx)(o,{...e,tempo:t,onTempoChange:n,loop:r,onLoopChange:i,isPlaying:a,onTogglePlay:()=>l(e=>!e)})},args:f,play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:/play/i})),await l(e.getByRole(`button`,{name:/pause/i})).toBeInTheDocument()}},_={render:e=>(0,c.jsx)(`div`,{className:`w-[390px]`,children:(0,c.jsx)(i,{...e,progress:[{weight:7,fill:100},{weight:7,fill:40},{weight:10,fill:0}]})}),args:f,play:async({args:e,canvas:t,userEvent:n})=>{await n.click(t.getByRole(`button`,{name:`Play`})),await l(e.onTogglePlay).toHaveBeenCalledOnce(),await n.click(t.getByRole(`button`,{name:`Loop flow`})),await l(e.onLoopChange).toHaveBeenCalledWith(!1)}},v=[`Default`,`Playing`,`WithoutMute`,`Interactive`,`Compact`],p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: defaultArgs,
  play: async ({
    args,
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole("button", {
      name: /play/i
    }));
    await expect(args.onTogglePlay).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("button", {
      name: /stop/i
    }));
    await expect(args.onStop).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("switch", {
      name: /loop flow/i
    }));
    await expect(args.onLoopChange).toHaveBeenCalledWith(false);
    await userEvent.click(canvas.getByRole("button", {
      name: "Mute"
    }));
    await expect(args.onMutedChange).toHaveBeenCalledWith(true);
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultArgs,
    isPlaying: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole("button", {
      name: /pause/i
    })).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultArgs,
    muted: undefined,
    onMutedChange: undefined
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [tempo, setTempo] = useState(args.tempo);
    const [loop, setLoop] = useState(args.loop);
    const [isPlaying, setIsPlaying] = useState(false);
    return <Component {...args} tempo={tempo} onTempoChange={setTempo} loop={loop} onLoopChange={setLoop} isPlaying={isPlaying} onTogglePlay={() => setIsPlaying(p => !p)} />;
  },
  args: defaultArgs,
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole("button", {
      name: /play/i
    }));
    await expect(canvas.getByRole("button", {
      name: /pause/i
    })).toBeInTheDocument();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: args => <div className="w-[390px]">
      <CompactTransportControls {...args} progress={[{
      weight: 7,
      fill: 100
    }, {
      weight: 7,
      fill: 40
    }, {
      weight: 10,
      fill: 0
    }]} />
    </div>,
  args: defaultArgs,
  play: async ({
    args,
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole("button", {
      name: "Play"
    }));
    await expect(args.onTogglePlay).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("button", {
      name: "Loop flow"
    }));
    await expect(args.onLoopChange).toHaveBeenCalledWith(false);
  }
}`,..._.parameters?.docs?.source}}}})))()}y();export{_ as Compact,p as Default,g as Interactive,m as Playing,h as WithoutMute,v as __namedExportsOrder,d as default};