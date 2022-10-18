const widget = await createWidget()
const bgColor = new Color("000000")
widget.backgroundColor = bgColor
Script.setWidget(widget)
Script.complete()
widget.presentSmall()

async function createWidget() {
  const list = new ListWidget();
  const schedule = await fetchSchedule()
  
  let imageStack = list.addStack()
  imageStack.layoutVertically()

  let coverImage = await getImage(schedule.trackImageName, schedule.trackImageUrl)
  let cover = imageStack.addImage(coverImage)

  let infoStack = list.addStack()
  infoStack.layoutVertically()

  const roundText = infoStack.addText("ROUND " + schedule.round)
  const countryText = infoStack.addText(schedule.country)
  const gpText = infoStack.addText(schedule.grandPrixName)
  const beginDate = new Date(schedule.startAt)
  const endDate = new Date(schedule.endAt)
  const beginMonth = beginDate.toLocaleString('default', { month: 'short' })
  const endMonth = endDate.toLocaleString('default', { month: 'short' })
  const dateText = beginMonth === endMonth ? 
    infoStack.addText(`${beginDate.getDate()} - ${endDate.getDate()} ${beginDate.toLocaleString('default', { month: 'long' })}`) :
    infoStack.addText(`${beginDate.getDate()} ${beginMonth} - ${endDate.getDate()} ${endMonth}`)

  roundText.font = Font.boldRoundedSystemFont(10)
  countryText.font = Font.blackRoundedSystemFont(16)
  gpText.font = Font.boldRoundedSystemFont(10)
  dateText.font = Font.boldRoundedSystemFont(10)

  roundText.textColor = Color.purple()
  
  return list;
}

async function fetchSchedule() {
  const req = new Request("https://rrgsqujyiqonxehgjekw.functions.supabase.co/formula-schedule")
  req.method = "GET"
  return await req.loadJSON()
}

async function getImage(imageName, imageUrl) {
  let fm = FileManager.local()
  let dir = fm.documentsDirectory()
  let path = fm.joinPath(dir, imageName)
  if(fm.fileExists(path)) {
    return fm.readImage(path)
  } else {
    let trackImage = await loadImage(imageUrl)
    fm.writeImage(path, trackImage)
    return trackImage
  }
}

async function loadImage(imgUrl) {
    const req = new Request(imgUrl)
    return await req.loadImage()
}
