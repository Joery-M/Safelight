export enum EbmlElements {
    EBMLHead = 0x1a45dfa3,
    EBMLVersion = 0x4286,
    EBMLReadVersion = 0x42f7,
    EBMLMaxIDLength = 0x42f2,
    EBMLMaxSizeLength = 0x42f3,
    DocType = 0x4282,
    DocTypeVersion = 0x4287,
    DocTypeReadVersion = 0x4285,
    CRC32 = 0xbf,
    void = 0xec,
    SignatureSlot = 0x1b538667,
    SignatureAlgo = 0x7e8a,
    SignatureHash = 0x7e9a,
    SignaturePublicKey = 0x7ea5,
    Signature = 0x7eb5,
    SignatureElements = 0x7e5b,
    SignatureElementList = 0x7e7b,
    SignedElement = 0x6532
}

export enum MatroskaElements {
    EBMLMaxIDLength = 0x42f2,
    EBMLMaxSizeLength = 0x42f3,
    Segment = 0x18538067,
    SeekHead = 0x114d9b74,
    Seek = 0x4dbb,
    SeekID = 0x53ab,
    SeekPosition = 0x53ac,
    Info = 0x1549a966,
    SegmentUUID = 0x73a4,
    SegmentFilename = 0x7384,
    PrevUUID = 0x3cb923,
    PrevFilename = 0x3c83ab,
    NextUUID = 0x3eb923,
    NextFilename = 0x3e83bb,
    SegmentFamily = 0x4444,
    ChapterTranslate = 0x6924,
    ChapterTranslateID = 0x69a5,
    ChapterTranslateCodec = 0x69bf,
    ChapterTranslateEditionUID = 0x69fc,
    TimestampScale = 0x2ad7b1,
    Duration = 0x4489,
    DateUTC = 0x4461,
    Title = 0x7ba9,
    MuxingApp = 0x4d80,
    WritingApp = 0x5741,
    Cluster = 0x1f43b675,
    Timestamp = 0xe7,
    SilentTracks = 0x5854,
    SilentTrackNumber = 0x58d7,
    Position = 0xa7,
    PrevSize = 0xab,
    SimpleBlock = 0xa3,
    BlockGroup = 0xa0,
    Block = 0xa1,
    BlockVirtual = 0xa2,
    BlockAdditions = 0x75a1,
    BlockMore = 0xa6,
    BlockAdditional = 0xa5,
    BlockAddID = 0xee,
    BlockDuration = 0x9b,
    ReferencePriority = 0xfa,
    ReferenceBlock = 0xfb,
    ReferenceVirtual = 0xfd,
    CodecState = 0xa4,
    DiscardPadding = 0x75a2,
    Slices = 0x8e,
    TimeSlice = 0xe8,
    LaceNumber = 0xcc,
    FrameNumber = 0xcd,
    BlockAdditionID = 0xcb,
    Delay = 0xce,
    SliceDuration = 0xcf,
    ReferenceFrame = 0xc8,
    ReferenceOffset = 0xc9,
    ReferenceTimestamp = 0xca,
    EncryptedBlock = 0xaf,
    Tracks = 0x1654ae6b,
    TrackEntry = 0xae,
    TrackNumber = 0xd7,
    TrackUID = 0x73c5,
    TrackType = 0x83,
    FlagEnabled = 0xb9,
    FlagDefault = 0x88,
    FlagForced = 0x55aa,
    FlagHearingImpaired = 0x55ab,
    FlagVisualImpaired = 0x55ac,
    FlagTextDescriptions = 0x55ad,
    FlagOriginal = 0x55ae,
    FlagCommentary = 0x55af,
    FlagLacing = 0x9c,
    MinCache = 0x6de7,
    MaxCache = 0x6df8,
    DefaultDuration = 0x23e383,
    DefaultDecodedFieldDuration = 0x234e7a,
    TrackTimestampScale = 0x23314f,
    TrackOffset = 0x537f,
    MaxBlockAdditionID = 0x55ee,
    BlockAdditionMapping = 0x41e4,
    BlockAddIDValue = 0x41f0,
    BlockAddIDName = 0x41a4,
    BlockAddIDType = 0x41e7,
    BlockAddIDExtraData = 0x41ed,
    Name = 0x536e,
    Language = 0x22b59c,
    LanguageBCP47 = 0x22b59d,
    CodecID = 0x86,
    CodecPrivate = 0x63a2,
    CodecName = 0x258688,
    AttachmentLink = 0x7446,
    CodecSettings = 0x3a9697,
    CodecInfoURL = 0x3b4040,
    CodecDownloadURL = 0x26b240,
    CodecDecodeAll = 0xaa,
    TrackOverlay = 0x6fab,
    CodecDelay = 0x56aa,
    SeekPreRoll = 0x56bb,
    TrackTranslate = 0x6624,
    TrackTranslateTrackID = 0x66a5,
    TrackTranslateCodec = 0x66bf,
    TrackTranslateEditionUID = 0x66fc,
    Video = 0xe0,
    FlagInterlaced = 0x9a,
    FieldOrder = 0x9d,
    StereoMode = 0x53b8,
    AlphaMode = 0x53c0,
    OldStereoMode = 0x53b9,
    PixelWidth = 0xb0,
    PixelHeight = 0xba,
    PixelCropBottom = 0x54aa,
    PixelCropTop = 0x54bb,
    PixelCropLeft = 0x54cc,
    PixelCropRight = 0x54dd,
    DisplayWidth = 0x54b0,
    DisplayHeight = 0x54ba,
    DisplayUnit = 0x54b2,
    AspectRatioType = 0x54b3,
    UncompressedFourCC = 0x2eb524,
    GammaValue = 0x2fb523,
    FrameRate = 0x2383e3,
    Colour = 0x55b0,
    MatrixCoefficients = 0x55b1,
    BitsPerChannel = 0x55b2,
    ChromaSubsamplingHorz = 0x55b3,
    ChromaSubsamplingVert = 0x55b4,
    CbSubsamplingHorz = 0x55b5,
    CbSubsamplingVert = 0x55b6,
    ChromaSitingHorz = 0x55b7,
    ChromaSitingVert = 0x55b8,
    Range = 0x55b9,
    TransferCharacteristics = 0x55ba,
    Primaries = 0x55bb,
    MaxCLL = 0x55bc,
    MaxFALL = 0x55bd,
    MasteringMetadata = 0x55d0,
    PrimaryRChromaticityX = 0x55d1,
    PrimaryRChromaticityY = 0x55d2,
    PrimaryGChromaticityX = 0x55d3,
    PrimaryGChromaticityY = 0x55d4,
    PrimaryBChromaticityX = 0x55d5,
    PrimaryBChromaticityY = 0x55d6,
    WhitePointChromaticityX = 0x55d7,
    WhitePointChromaticityY = 0x55d8,
    LuminanceMax = 0x55d9,
    LuminanceMin = 0x55da,
    Projection = 0x7670,
    ProjectionType = 0x7671,
    ProjectionPrivate = 0x7672,
    ProjectionPoseYaw = 0x7673,
    ProjectionPosePitch = 0x7674,
    ProjectionPoseRoll = 0x7675,
    Audio = 0xe1,
    SamplingFrequency = 0xb5,
    OutputSamplingFrequency = 0x78b5,
    Channels = 0x9f,
    ChannelPositions = 0x7d7b,
    BitDepth = 0x6264,
    Emphasis = 0x52f1,
    TrackOperation = 0xe2,
    TrackCombinePlanes = 0xe3,
    TrackPlane = 0xe4,
    TrackPlaneUID = 0xe5,
    TrackPlaneType = 0xe6,
    TrackJoinBlocks = 0xe9,
    TrackJoinUID = 0xed,
    TrickTrackUID = 0xc0,
    TrickTrackSegmentUID = 0xc1,
    TrickTrackFlag = 0xc6,
    TrickMasterTrackUID = 0xc7,
    TrickMasterTrackSegmentUID = 0xc4,
    ContentEncodings = 0x6d80,
    ContentEncoding = 0x6240,
    ContentEncodingOrder = 0x5031,
    ContentEncodingScope = 0x5032,
    ContentEncodingType = 0x5033,
    ContentCompression = 0x5034,
    ContentCompAlgo = 0x4254,
    ContentCompSettings = 0x4255,
    ContentEncryption = 0x5035,
    ContentEncAlgo = 0x47e1,
    ContentEncKeyID = 0x47e2,
    ContentEncAESSettings = 0x47e7,
    AESSettingsCipherMode = 0x47e8,
    ContentSignature = 0x47e3,
    ContentSigKeyID = 0x47e4,
    ContentSigAlgo = 0x47e5,
    ContentSigHashAlgo = 0x47e6,
    Cues = 0x1c53bb6b,
    CuePoint = 0xbb,
    CueTime = 0xb3,
    CueTrackPositions = 0xb7,
    CueTrack = 0xf7,
    CueClusterPosition = 0xf1,
    CueRelativePosition = 0xf0,
    CueDuration = 0xb2,
    CueBlockNumber = 0x5378,
    CueCodecState = 0xea,
    CueReference = 0xdb,
    CueRefTime = 0x96,
    CueRefCluster = 0x97,
    CueRefNumber = 0x535f,
    CueRefCodecState = 0xeb,
    Attachments = 0x1941a469,
    AttachedFile = 0x61a7,
    FileDescription = 0x467e,
    FileName = 0x466e,
    FileMediaType = 0x4660,
    FileData = 0x465c,
    FileUID = 0x46ae,
    FileReferral = 0x4675,
    FileUsedStartTime = 0x4661,
    FileUsedEndTime = 0x4662,
    Chapters = 0x1043a770,
    EditionEntry = 0x45b9,
    EditionUID = 0x45bc,
    EditionFlagHidden = 0x45bd,
    EditionFlagDefault = 0x45db,
    EditionFlagOrdered = 0x45dd,
    EditionDisplay = 0x4520,
    EditionString = 0x4521,
    EditionLanguageIETF = 0x45e4,
    ChapterAtom = 0xb6,
    ChapterUID = 0x73c4,
    ChapterStringUID = 0x5654,
    ChapterTimeStart = 0x91,
    ChapterTimeEnd = 0x92,
    ChapterFlagHidden = 0x98,
    ChapterFlagEnabled = 0x4598,
    ChapterSegmentUUID = 0x6e67,
    ChapterSkipType = 0x4588,
    ChapterSegmentEditionUID = 0x6ebc,
    ChapterPhysicalEquiv = 0x63c3,
    ChapterTrack = 0x8f,
    ChapterTrackUID = 0x89,
    ChapterDisplay = 0x80,
    ChapString = 0x85,
    ChapLanguage = 0x437c,
    ChapLanguageBCP47 = 0x437d,
    ChapCountry = 0x437e,
    ChapProcess = 0x6944,
    ChapProcessCodecID = 0x6955,
    ChapProcessPrivate = 0x450d,
    ChapProcessCommand = 0x6911,
    ChapProcessTime = 0x6922,
    ChapProcessData = 0x6933,
    Tags = 0x1254c367,
    Tag = 0x7373,
    Targets = 0x63c0,
    TargetTypeValue = 0x68ca,
    TargetType = 0x63ca,
    TagTrackUID = 0x63c5,
    TagEditionUID = 0x63c9,
    TagChapterUID = 0x63c4,
    TagAttachmentUID = 0x63c6,
    SimpleTag = 0x67c8,
    TagName = 0x45a3,
    TagLanguage = 0x447a,
    TagLanguageBCP47 = 0x447b,
    TagDefault = 0x4484,
    TagDefaultBogus = 0x44b4,
    TagString = 0x4487,
    TagBinary = 0x4485
}

export const MasterElements = [
    EbmlElements.EBMLHead,
    EbmlElements.SignatureSlot,
    EbmlElements.SignatureElements,
    EbmlElements.SignatureElementList,
    MatroskaElements.Segment,
    MatroskaElements.SeekHead,
    MatroskaElements.Seek,
    MatroskaElements.Info,
    MatroskaElements.ChapterTranslate,
    MatroskaElements.Cluster,
    MatroskaElements.SilentTracks,
    MatroskaElements.BlockGroup,
    MatroskaElements.BlockAdditions,
    MatroskaElements.BlockMore,
    MatroskaElements.Slices,
    MatroskaElements.TimeSlice,
    MatroskaElements.ReferenceFrame,
    MatroskaElements.Tracks,
    MatroskaElements.TrackEntry,
    MatroskaElements.BlockAdditionMapping,
    MatroskaElements.TrackTranslate,
    MatroskaElements.Video,
    MatroskaElements.Colour,
    MatroskaElements.MasteringMetadata,
    MatroskaElements.Projection,
    MatroskaElements.Audio,
    MatroskaElements.TrackOperation,
    MatroskaElements.TrackCombinePlanes,
    MatroskaElements.TrackPlane,
    MatroskaElements.TrackJoinBlocks,
    MatroskaElements.ContentEncodings,
    MatroskaElements.ContentEncoding,
    MatroskaElements.ContentCompression,
    MatroskaElements.ContentEncryption,
    MatroskaElements.ContentEncAESSettings,
    MatroskaElements.Cues,
    MatroskaElements.CuePoint,
    MatroskaElements.CueTrackPositions,
    MatroskaElements.CueReference,
    MatroskaElements.Attachments,
    MatroskaElements.AttachedFile,
    MatroskaElements.Chapters,
    MatroskaElements.EditionEntry,
    MatroskaElements.EditionDisplay,
    MatroskaElements.ChapterAtom,
    MatroskaElements.ChapterTrack,
    MatroskaElements.ChapterDisplay,
    MatroskaElements.ChapProcess,
    MatroskaElements.ChapProcessCommand,
    MatroskaElements.Tags,
    MatroskaElements.Tag,
    MatroskaElements.Targets,
    MatroskaElements.SimpleTag
];
export const ElementInfo = {
    /**
     * @type MatroskaElements.EBMLMaxIDLength
     */
    0x42f2: {
        name: 'EBMLMaxIDLength',
        path: '\\EBML\\EBMLMaxIDLength',
        id: '0x42F2',
        type: 'uinteger',
        range: '4',
        default: '4',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.EBMLMaxSizeLength
     */
    0x42f3: {
        name: 'EBMLMaxSizeLength',
        path: '\\EBML\\EBMLMaxSizeLength',
        id: '0x42F3',
        type: 'uinteger',
        range: '1-8',
        default: '8',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.Segment
     * @definition
     * The Root Element that contains all other Top-Level Elements; see (#data-layout).
     *
     */
    0x18538067: {
        name: 'Segment',
        path: '\\Segment',
        id: '0x18538067',
        type: 'master',
        minOccurs: '1',
        maxOccurs: '1',
        unknownsizeallowed: '1'
    },
    /**
     * @type MatroskaElements.SeekHead
     * @definition
     * Contains seeking information of Top-Level Elements; see (#data-layout).
     *
     */
    0x114d9b74: {
        name: 'SeekHead',
        path: '\\Segment\\SeekHead',
        id: '0x114D9B74',
        type: 'master',
        maxOccurs: '2'
    },
    /**
     * @type MatroskaElements.Seek
     * @definition
     * Contains a single seek entry to an EBML Element.
     *
     */
    0x4dbb: {
        name: 'Seek',
        path: '\\Segment\\SeekHead\\Seek',
        id: '0x4DBB',
        type: 'master',
        minOccurs: '1'
    },
    /**
     * @type MatroskaElements.SeekID
     * @definition
     * The binary EBML ID of a Top-Level Element.
     *
     */
    0x53ab: {
        name: 'SeekID',
        path: '\\Segment\\SeekHead\\Seek\\SeekID',
        id: '0x53AB',
        type: 'binary',
        length: '4',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.SeekPosition
     * @definition
     * The Segment Position ((#segment-position)) of a Top-Level Element.
     *
     */
    0x53ac: {
        name: 'SeekPosition',
        path: '\\Segment\\SeekHead\\Seek\\SeekPosition',
        id: '0x53AC',
        type: 'uinteger',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.Info
     * @definition
     * Contains general information about the Segment.
     *
     */
    0x1549a966: {
        name: 'Info',
        path: '\\Segment\\Info',
        id: '0x1549A966',
        type: 'master',
        minOccurs: '1',
        maxOccurs: '1',
        recurring: '1'
    },
    /**
     * @type MatroskaElements.SegmentUUID
     * @definition
     * A randomly generated UID that identifies the Segment amongst many others (128 bits). It is equivalent to a Universally Unique Identifier (UUID) v4 [@!RFC4122] with all bits randomly (or pseudorandomly) chosen.  An actual UUID v4 value, where some bits are not random, **MAY** also be used.
     *
     * @usage notes
     * If the Segment is a part of a Linked Segment, then this Element is **REQUIRED**.
The value of the UID **MUST** contain at least one bit set to 1.
     *
     */
    0x73a4: {
        name: 'SegmentUUID',
        path: '\\Segment\\Info\\SegmentUUID',
        id: '0x73A4',
        type: 'binary',
        length: '16',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.SegmentFilename
     * @definition
     * A filename corresponding to this Segment.
     *
     */
    0x7384: {
        name: 'SegmentFilename',
        path: '\\Segment\\Info\\SegmentFilename',
        id: '0x7384',
        type: 'utf-8',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.PrevUUID
     * @definition
     * An ID that identifies the previous Segment of a Linked Segment.
     *
     * @usage notes
     * If the Segment is a part of a Linked Segment that uses Hard Linking ((#hard-linking)),
then either the PrevUUID or the NextUUID Element is **REQUIRED**. If a Segment contains a PrevUUID but not a NextUUID,
then it **MAY** be considered as the last Segment of the Linked Segment. The PrevUUID **MUST NOT** be equal to the SegmentUUID.
     *
     */
    0x3cb923: {
        name: 'PrevUUID',
        path: '\\Segment\\Info\\PrevUUID',
        id: '0x3CB923',
        type: 'binary',
        length: '16',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.PrevFilename
     * @definition
     * A filename corresponding to the file of the previous Linked Segment.
     *
     * @usage notes
     * Provision of the previous filename is for display convenience,
but PrevUUID **SHOULD** be considered authoritative for identifying the previous Segment in a Linked Segment.
     *
     */
    0x3c83ab: {
        name: 'PrevFilename',
        path: '\\Segment\\Info\\PrevFilename',
        id: '0x3C83AB',
        type: 'utf-8',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.NextUUID
     * @definition
     * An ID that identifies the next Segment of a Linked Segment.
     *
     * @usage notes
     * If the Segment is a part of a Linked Segment that uses Hard Linking ((#hard-linking)),
then either the PrevUUID or the NextUUID Element is **REQUIRED**. If a Segment contains a NextUUID but not a PrevUUID,
then it **MAY** be considered as the first Segment of the Linked Segment. The NextUUID **MUST NOT** be equal to the SegmentUUID.
     *
     */
    0x3eb923: {
        name: 'NextUUID',
        path: '\\Segment\\Info\\NextUUID',
        id: '0x3EB923',
        type: 'binary',
        length: '16',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.NextFilename
     * @definition
     * A filename corresponding to the file of the next Linked Segment.
     *
     * @usage notes
     * Provision of the next filename is for display convenience,
but NextUUID **SHOULD** be considered authoritative for identifying the Next Segment.
     *
     */
    0x3e83bb: {
        name: 'NextFilename',
        path: '\\Segment\\Info\\NextFilename',
        id: '0x3E83BB',
        type: 'utf-8',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.SegmentFamily
     * @definition
     * A UID that all Segments of a Linked Segment **MUST** share (128 bits). It is equivalent to a UUID v4 [@!RFC4122] with all bits randomly (or pseudorandomly) chosen. An actual UUID v4 value, where some bits are not random, **MAY** also be used.
     *
     * @usage notes
     * If the Segment Info contains a `ChapterTranslate` element, this Element is **REQUIRED**.
     *
     */
    0x4444: {
        name: 'SegmentFamily',
        path: '\\Segment\\Info\\SegmentFamily',
        id: '0x4444',
        type: 'binary',
        length: '16'
    },
    /**
     * @type MatroskaElements.ChapterTranslate
     * @definition
     * The mapping between this `Segment` and a segment value in the given Chapter Codec.
     *
     * @rationale
     * Chapter Codec may need to address different segments, but they may not know of the way to identify such segments when stored in Matroska.
This element and its child elements add a way to map the internal segments known to the Chapter Codec to the Segment IDs in Matroska.
This allows remuxing a file with Chapter Codec without changing the content of the codec data, just the Segment mapping.
     *
     */
    0x6924: {
        name: 'ChapterTranslate',
        path: '\\Segment\\Info\\ChapterTranslate',
        id: '0x6924',
        type: 'master'
    },
    /**
     * @type MatroskaElements.ChapterTranslateID
     * @definition
     * The binary value used to represent this Segment in the chapter codec data.
The format depends on the ChapProcessCodecID used; see (#chapprocesscodecid-element).
     *
     */
    0x69a5: {
        name: 'ChapterTranslateID',
        path: '\\Segment\\Info\\ChapterTranslate\\ChapterTranslateID',
        id: '0x69A5',
        type: 'binary',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChapterTranslateCodec
     * @definition
     * This `ChapterTranslate` applies to the chapter codec of the given chapter edition(s); see (#chapprocesscodecid-element).
     *
     */
    0x69bf: {
        name: 'ChapterTranslateCodec',
        path: '\\Segment\\Info\\ChapterTranslate\\ChapterTranslateCodec',
        id: '0x69BF',
        type: 'uinteger',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChapterTranslateEditionUID
     * @definition
     * Specifies a chapter edition UID to which this `ChapterTranslate` applies.
     *
     * @usage notes
     * When no `ChapterTranslateEditionUID` is specified in the `ChapterTranslate`, the `ChapterTranslate` applies to all chapter editions found in the Segment using the given `ChapterTranslateCodec`.
     *
     */
    0x69fc: {
        name: 'ChapterTranslateEditionUID',
        path: '\\Segment\\Info\\ChapterTranslate\\ChapterTranslateEditionUID',
        id: '0x69FC',
        type: 'uinteger'
    },
    /**
     * @type MatroskaElements.TimestampScale
     * @definition
     * Base unit for Segment Ticks and Track Ticks, in nanoseconds. A TimestampScale value of 1000000 means scaled timestamps in the Segment are expressed in milliseconds; see (#timestamps) on how to interpret timestamps.
     *
     */
    0x2ad7b1: {
        name: 'TimestampScale',
        path: '\\Segment\\Info\\TimestampScale',
        id: '0x2AD7B1',
        type: 'uinteger',
        range: 'not 0',
        default: '1000000',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.Duration
     * @definition
     * Duration of the Segment, expressed in Segment Ticks, which are based on TimestampScale; see (#timestamp-ticks).
     *
     */
    0x4489: {
        name: 'Duration',
        path: '\\Segment\\Info\\Duration',
        id: '0x4489',
        type: 'float',
        range: '> 0x0p+0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.DateUTC
     * @definition
     * The date and time that the Segment was created by the muxing application or library.
     *
     */
    0x4461: {
        name: 'DateUTC',
        path: '\\Segment\\Info\\DateUTC',
        id: '0x4461',
        type: 'date',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.Title
     * @definition
     * General name of the Segment.
     *
     */
    0x7ba9: {
        name: 'Title',
        path: '\\Segment\\Info\\Title',
        id: '0x7BA9',
        type: 'utf-8',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.MuxingApp
     * @definition
     * Muxing application or library (example: "libmatroska-0.4.3").
     *
     * @usage notes
     * Include the full name of the application or library followed by the version number.
     *
     */
    0x4d80: {
        name: 'MuxingApp',
        path: '\\Segment\\Info\\MuxingApp',
        id: '0x4D80',
        type: 'utf-8',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.WritingApp
     * @definition
     * Writing application (example: "mkvmerge-0.3.3").
     *
     * @usage notes
     * Include the full name of the application followed by the version number.
     *
     */
    0x5741: {
        name: 'WritingApp',
        path: '\\Segment\\Info\\WritingApp',
        id: '0x5741',
        type: 'utf-8',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.Cluster
     * @definition
     * The Top-Level Element containing the (monolithic) Block structure.
     *
     */
    0x1f43b675: {
        name: 'Cluster',
        path: '\\Segment\\Cluster',
        id: '0x1F43B675',
        type: 'master',
        unknownsizeallowed: '1'
    },
    /**
     * @type MatroskaElements.Timestamp
     * @definition
     * Absolute timestamp of the cluster, expressed in Segment Ticks, which are based on TimestampScale; see (#timestamp-ticks).
     *
     * @usage notes
     * This element **SHOULD** be the first child element of the Cluster it belongs to
or the second if that Cluster contains a CRC-32 element ((#crc-32)).
     *
     */
    0xe7: {
        name: 'Timestamp',
        path: '\\Segment\\Cluster\\Timestamp',
        id: '0xE7',
        type: 'uinteger',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.SilentTracks
     * @definition
     * The list of tracks that are not used in that part of the stream.
It is useful when using overlay tracks for seeking or deciding what track to use.
     *
     */
    0x5854: {
        name: 'SilentTracks',
        path: '\\Segment\\Cluster\\SilentTracks',
        id: '0x5854',
        type: 'master',
        minver: '0',
        maxver: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.SilentTrackNumber
     * @definition
     * One of the track numbers that is not used from now on in the stream.
It could change later if not specified as silent in a further Cluster.
     *
     */
    0x58d7: {
        name: 'SilentTrackNumber',
        path: '\\Segment\\Cluster\\SilentTracks\\SilentTrackNumber',
        id: '0x58D7',
        type: 'uinteger',
        minver: '0',
        maxver: '0'
    },
    /**
     * @type MatroskaElements.Position
     * @definition
     * The Segment Position of the Cluster in the Segment (0 in live streams).
It might help to resynchronize the offset on damaged streams.
     *
     */
    0xa7: {
        name: 'Position',
        path: '\\Segment\\Cluster\\Position',
        id: '0xA7',
        type: 'uinteger',
        maxver: '4',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.PrevSize
     * @definition
     * Size of the previous Cluster, in octets. Can be useful for backward playing.
     *
     */
    0xab: {
        name: 'PrevSize',
        path: '\\Segment\\Cluster\\PrevSize',
        id: '0xAB',
        type: 'uinteger',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.SimpleBlock
     * @definition
     * Similar to Block (see (#block-structure)) but without all the extra information.
Mostly used to reduce overhead when no extra feature is needed; see (#simpleblock-structure) on SimpleBlock Structure.
     *
     */
    0xa3: {
        name: 'SimpleBlock',
        path: '\\Segment\\Cluster\\SimpleBlock',
        id: '0xA3',
        type: 'binary',
        minver: '2'
    },
    /**
     * @type MatroskaElements.BlockGroup
     * @definition
     * Basic container of information containing a single Block and information specific to that Block.
     *
     */
    0xa0: {
        name: 'BlockGroup',
        path: '\\Segment\\Cluster\\BlockGroup',
        id: '0xA0',
        type: 'master'
    },
    /**
     * @type MatroskaElements.Block
     * @definition
     * Block containing the actual data to be rendered and a timestamp relative to the Cluster Timestamp;
see (#block-structure) on Block Structure.
     *
     */
    0xa1: {
        name: 'Block',
        path: '\\Segment\\Cluster\\BlockGroup\\Block',
        id: '0xA1',
        type: 'binary',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.BlockVirtual
     * @definition
     * A Block with no data. It must be stored in the stream at the place the real Block would be in display order.
     *
     */
    0xa2: {
        name: 'BlockVirtual',
        path: '\\Segment\\Cluster\\BlockGroup\\BlockVirtual',
        id: '0xA2',
        type: 'binary',
        minver: '0',
        maxver: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.BlockAdditions
     * @definition
     * Contains additional binary data to complete the main one; see [@?I-D.ietf-cellar-codec, section 4.1.5] for more information.
An EBML parser that has no knowledge of the Block structure could still see and use/skip these data.
     *
     */
    0x75a1: {
        name: 'BlockAdditions',
        path: '\\Segment\\Cluster\\BlockGroup\\BlockAdditions',
        id: '0x75A1',
        type: 'master',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.BlockMore
     * @definition
     * Contains the BlockAdditional and some parameters.
     *
     */
    0xa6: {
        name: 'BlockMore',
        path: '\\Segment\\Cluster\\BlockGroup\\BlockAdditions\\BlockMore',
        id: '0xA6',
        type: 'master',
        minOccurs: '1'
    },
    /**
     * @type MatroskaElements.BlockAdditional
     * @definition
     * Interpreted by the codec as it wishes (using the BlockAddID).
     *
     */
    0xa5: {
        name: 'BlockAdditional',
        path: '\\Segment\\Cluster\\BlockGroup\\BlockAdditions\\BlockMore\\BlockAdditional',
        id: '0xA5',
        type: 'binary',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.BlockAddID
     * @definition
     * An ID that identifies how to interpret the BlockAdditional data; see [@?I-D.ietf-cellar-codec, section 4.1.5] for more information.
A value of 1 indicates that the meaning of the BlockAdditional data is defined by the codec.
Any other value indicates the meaning of the BlockAdditional data is found in the BlockAddIDType found in the TrackEntry.
     *
     * @usage notes
     * Each BlockAddID value **MUST** be unique between all BlockMore elements found in a BlockAdditions.
     *
     * @usage notes
     * To keep MaxBlockAdditionID as low as possible, small values **SHOULD** be used.
     *
     */
    0xee: {
        name: 'BlockAddID',
        path: '\\Segment\\Cluster\\BlockGroup\\BlockAdditions\\BlockMore\\BlockAddID',
        id: '0xEE',
        type: 'uinteger',
        range: 'not 0',
        default: '1',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.BlockDuration
     * @definition
     * The duration of the Block, expressed in Track Ticks; see (#timestamp-ticks).
The BlockDuration Element can be useful at the end of a Track to define the duration of the last frame (as there is no subsequent Block available)
or when there is a break in a track like for subtitle tracks.
     *
     */
    0x9b: {
        name: 'BlockDuration',
        path: '\\Segment\\Cluster\\BlockGroup\\BlockDuration',
        id: '0x9B',
        type: 'uinteger',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ReferencePriority
     * @definition
     * This frame is referenced and has the specified cache priority.
In the cache, only a frame of the same or higher priority can replace this frame. A value of 0 means the frame is not referenced.
     *
     */
    0xfa: {
        name: 'ReferencePriority',
        path: '\\Segment\\Cluster\\BlockGroup\\ReferencePriority',
        id: '0xFA',
        type: 'uinteger',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ReferenceBlock
     * @definition
     * A timestamp value, relative to the timestamp of the Block in this BlockGroup, expressed in Track Ticks; see (#timestamp-ticks).
This is used to reference other frames necessary to decode this frame.
The relative value **SHOULD** correspond to a valid `Block` that this `Block` depends on.
Historically, Matroska Writers didn't write the actual `Block(s)` that this `Block` depends on, but they did write *some* `Block(s)` in the past.

The value "0" **MAY** also be used to signify that this `Block` cannot be decoded on its own, but without knowledge of which `Block` is necessary. In this case, other `ReferenceBlock` Elements **MUST NOT** be found in the same `BlockGroup`.

If the `BlockGroup` doesn't have a `ReferenceBlock` element, then the `Block` it contains can be decoded without using any other `Block` data.
     *
     */
    0xfb: {
        name: 'ReferenceBlock',
        path: '\\Segment\\Cluster\\BlockGroup\\ReferenceBlock',
        id: '0xFB',
        type: 'integer'
    },
    /**
     * @type MatroskaElements.ReferenceVirtual
     * @definition
     * The Segment Position of the data that would otherwise be in position of the virtual block.
     *
     */
    0xfd: {
        name: 'ReferenceVirtual',
        path: '\\Segment\\Cluster\\BlockGroup\\ReferenceVirtual',
        id: '0xFD',
        type: 'integer',
        minver: '0',
        maxver: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.CodecState
     * @definition
     * The new codec state to use. Data interpretation is private to the codec.
This information **SHOULD** always be referenced by a seek entry.
     *
     */
    0xa4: {
        name: 'CodecState',
        path: '\\Segment\\Cluster\\BlockGroup\\CodecState',
        id: '0xA4',
        type: 'binary',
        minver: '2',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.DiscardPadding
     * @definition
     * Duration of the silent data added to the Block, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks)
(padding at the end of the Block for positive values and at the beginning of the Block for negative values).
The duration of DiscardPadding is not calculated in the duration of the TrackEntry and **SHOULD** be discarded during playback.
     *
     */
    0x75a2: {
        name: 'DiscardPadding',
        path: '\\Segment\\Cluster\\BlockGroup\\DiscardPadding',
        id: '0x75A2',
        type: 'integer',
        minver: '4',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.Slices
     * @definition
     * Contains slices description.
     *
     */
    0x8e: {
        name: 'Slices',
        path: '\\Segment\\Cluster\\BlockGroup\\Slices',
        id: '0x8E',
        type: 'master',
        minver: '0',
        maxver: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TimeSlice
     * @definition
     * Contains extra time information about the data contained in the Block.
Being able to interpret this Element is not required for playback.
     *
     */
    0xe8: {
        name: 'TimeSlice',
        path: '\\Segment\\Cluster\\BlockGroup\\Slices\\TimeSlice',
        id: '0xE8',
        type: 'master',
        minver: '0',
        maxver: '0'
    },
    /**
     * @type MatroskaElements.LaceNumber
     * @definition
     * The reverse number of the frame in the lace (0 is the last frame, 1 is the next to last, etc.).
Being able to interpret this Element is not required for playback.
     *
     */
    0xcc: {
        name: 'LaceNumber',
        path: '\\Segment\\Cluster\\BlockGroup\\Slices\\TimeSlice\\LaceNumber',
        id: '0xCC',
        type: 'uinteger',
        minver: '0',
        maxver: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.FrameNumber
     * @definition
     * The number of the frame to generate from this lace with this delay
(allows for the generation of many frames from the same Block/Frame).
     *
     */
    0xcd: {
        name: 'FrameNumber',
        path: '\\Segment\\Cluster\\BlockGroup\\Slices\\TimeSlice\\FrameNumber',
        id: '0xCD',
        type: 'uinteger',
        minver: '0',
        maxver: '0',
        default: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.BlockAdditionID
     * @definition
     * The ID of the BlockAdditional Element (0 is the main Block).
     *
     */
    0xcb: {
        name: 'BlockAdditionID',
        path: '\\Segment\\Cluster\\BlockGroup\\Slices\\TimeSlice\\BlockAdditionID',
        id: '0xCB',
        type: 'uinteger',
        minver: '0',
        maxver: '0',
        default: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.Delay
     * @definition
     * The delay to apply to the Element, expressed in Track Ticks; see (#timestamp-ticks).
     *
     */
    0xce: {
        name: 'Delay',
        path: '\\Segment\\Cluster\\BlockGroup\\Slices\\TimeSlice\\Delay',
        id: '0xCE',
        type: 'uinteger',
        minver: '0',
        maxver: '0',
        default: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.SliceDuration
     * @definition
     * The duration to apply to the Element, expressed in Track Ticks; see (#timestamp-ticks).
     *
     */
    0xcf: {
        name: 'SliceDuration',
        path: '\\Segment\\Cluster\\BlockGroup\\Slices\\TimeSlice\\SliceDuration',
        id: '0xCF',
        type: 'uinteger',
        minver: '0',
        maxver: '0',
        default: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ReferenceFrame
     * @definition
     * Contains information about the last reference frame. See [@?DivXTrickTrack].
     *
     */
    0xc8: {
        name: 'ReferenceFrame',
        path: '\\Segment\\Cluster\\BlockGroup\\ReferenceFrame',
        id: '0xC8',
        type: 'master',
        minver: '0',
        maxver: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ReferenceOffset
     * @definition
     * The relative offset, in bytes, from the previous BlockGroup element for this Smooth FF/RW video track to the containing BlockGroup element. See [@?DivXTrickTrack].
     *
     */
    0xc9: {
        name: 'ReferenceOffset',
        path: '\\Segment\\Cluster\\BlockGroup\\ReferenceFrame\\ReferenceOffset',
        id: '0xC9',
        type: 'uinteger',
        minver: '0',
        maxver: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ReferenceTimestamp
     * @definition
     * The timestamp of the BlockGroup pointed to by ReferenceOffset, expressed in Track Ticks; see (#timestamp-ticks). See [@?DivXTrickTrack].
     *
     */
    0xca: {
        name: 'ReferenceTimestamp',
        path: '\\Segment\\Cluster\\BlockGroup\\ReferenceFrame\\ReferenceTimestamp',
        id: '0xCA',
        type: 'uinteger',
        minver: '0',
        maxver: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.EncryptedBlock
     * @definition
     * Similar to SimpleBlock (see (#simpleblock-structure)),
but the data inside the Block are Transformed (encrypted and/or signed).
     *
     */
    0xaf: {
        name: 'EncryptedBlock',
        path: '\\Segment\\Cluster\\EncryptedBlock',
        id: '0xAF',
        type: 'binary',
        minver: '0',
        maxver: '0'
    },
    /**
     * @type MatroskaElements.Tracks
     * @definition
     * A Top-Level Element of information with many tracks described.
     *
     */
    0x1654ae6b: {
        name: 'Tracks',
        path: '\\Segment\\Tracks',
        id: '0x1654AE6B',
        type: 'master',
        maxOccurs: '1',
        recurring: '1'
    },
    /**
     * @type MatroskaElements.TrackEntry
     * @definition
     * Describes a track with all Elements.
     *
     */
    0xae: {
        name: 'TrackEntry',
        path: '\\Segment\\Tracks\\TrackEntry',
        id: '0xAE',
        type: 'master',
        minOccurs: '1'
    },
    /**
     * @type MatroskaElements.TrackNumber
     * @definition
     * The track number as used in the Block Header.
     *
     */
    0xd7: {
        name: 'TrackNumber',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackNumber',
        id: '0xD7',
        type: 'uinteger',
        range: 'not 0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TrackUID
     * @definition
     * A UID that identifies the Track.
     *
     */
    0x73c5: {
        name: 'TrackUID',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackUID',
        id: '0x73C5',
        type: 'uinteger',
        range: 'not 0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TrackType
     * @definition
     * The `TrackType` defines the type of each frame found in the Track.
The value **SHOULD** be stored on 1 octet.
     *
     */
    0x83: {
        name: 'TrackType',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackType',
        id: '0x83',
        type: 'uinteger',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.FlagEnabled
     * @definition
     * Set to 1 if the track is usable. It is possible to turn a track that is not usable into a usable track using chapter codecs or control tracks.
     *
     */
    0xb9: {
        name: 'FlagEnabled',
        path: '\\Segment\\Tracks\\TrackEntry\\FlagEnabled',
        id: '0xB9',
        type: 'uinteger',
        minver: '2',
        range: '0-1',
        default: '1',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.FlagDefault
     * @definition
     * Set if the track (audio, video, or subs) is eligible for automatic selection by the player; see (#default-track-selection) for more details.
     *
     */
    0x88: {
        name: 'FlagDefault',
        path: '\\Segment\\Tracks\\TrackEntry\\FlagDefault',
        id: '0x88',
        type: 'uinteger',
        range: '0-1',
        default: '1',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.FlagForced
     * @definition
     * Applies only to subtitles. Set if the track is eligible for automatic selection by the player if it matches the user's language preference,
even if the user's preferences would not normally enable subtitles with the selected audio track;
this can be used for tracks containing only translations of audio in foreign languages or on-screen text.
See (#default-track-selection) for more details.
     *
     */
    0x55aa: {
        name: 'FlagForced',
        path: '\\Segment\\Tracks\\TrackEntry\\FlagForced',
        id: '0x55AA',
        type: 'uinteger',
        range: '0-1',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.FlagHearingImpaired
     * @definition
     * Set to 1 if and only if the track is suitable for users with hearing impairments.
     *
     */
    0x55ab: {
        name: 'FlagHearingImpaired',
        path: '\\Segment\\Tracks\\TrackEntry\\FlagHearingImpaired',
        id: '0x55AB',
        type: 'uinteger',
        minver: '4',
        range: '0-1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.FlagVisualImpaired
     * @definition
     * Set to 1 if and only if the track is suitable for users with visual impairments.
     *
     */
    0x55ac: {
        name: 'FlagVisualImpaired',
        path: '\\Segment\\Tracks\\TrackEntry\\FlagVisualImpaired',
        id: '0x55AC',
        type: 'uinteger',
        minver: '4',
        range: '0-1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.FlagTextDescriptions
     * @definition
     * Set to 1 if and only if the track contains textual descriptions of video content.
     *
     */
    0x55ad: {
        name: 'FlagTextDescriptions',
        path: '\\Segment\\Tracks\\TrackEntry\\FlagTextDescriptions',
        id: '0x55AD',
        type: 'uinteger',
        minver: '4',
        range: '0-1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.FlagOriginal
     * @definition
     * Set to 1 if and only if the track is in the content's original language.
     *
     */
    0x55ae: {
        name: 'FlagOriginal',
        path: '\\Segment\\Tracks\\TrackEntry\\FlagOriginal',
        id: '0x55AE',
        type: 'uinteger',
        minver: '4',
        range: '0-1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.FlagCommentary
     * @definition
     * Set to 1 if and only if the track contains commentary.
     *
     */
    0x55af: {
        name: 'FlagCommentary',
        path: '\\Segment\\Tracks\\TrackEntry\\FlagCommentary',
        id: '0x55AF',
        type: 'uinteger',
        minver: '4',
        range: '0-1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.FlagLacing
     * @definition
     * Set to 1 if the track **MAY** contain blocks that use lacing. When set to 0, all blocks **MUST** have their lacing flags set to "no lacing"; see (#block-lacing) on Block Lacing.
     *
     */
    0x9c: {
        name: 'FlagLacing',
        path: '\\Segment\\Tracks\\TrackEntry\\FlagLacing',
        id: '0x9C',
        type: 'uinteger',
        range: '0-1',
        default: '1',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.MinCache
     * @definition
     * The minimum number of frames a player should be able to cache during playback.
If set to 0, the reference pseudo-cache system is not used.
     *
     */
    0x6de7: {
        name: 'MinCache',
        path: '\\Segment\\Tracks\\TrackEntry\\MinCache',
        id: '0x6DE7',
        type: 'uinteger',
        minver: '0',
        maxver: '0',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.MaxCache
     * @definition
     * The maximum cache size necessary to store referenced frames in and the current frame.
0 means no cache is needed.
     *
     */
    0x6df8: {
        name: 'MaxCache',
        path: '\\Segment\\Tracks\\TrackEntry\\MaxCache',
        id: '0x6DF8',
        type: 'uinteger',
        minver: '0',
        maxver: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.DefaultDuration
     * @definition
     * Number of nanoseconds per frame, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks)
("frame" in the Matroska sense -- one Element put into a (Simple)Block).
     *
     */
    0x23e383: {
        name: 'DefaultDuration',
        path: '\\Segment\\Tracks\\TrackEntry\\DefaultDuration',
        id: '0x23E383',
        type: 'uinteger',
        range: 'not 0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.DefaultDecodedFieldDuration
     * @definition
     * The period between two successive fields at the output of the decoding process, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks).
See (#defaultdecodedfieldduration) for more information.
     *
     */
    0x234e7a: {
        name: 'DefaultDecodedFieldDuration',
        path: '\\Segment\\Tracks\\TrackEntry\\DefaultDecodedFieldDuration',
        id: '0x234E7A',
        type: 'uinteger',
        minver: '4',
        range: 'not 0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TrackTimestampScale
     * @definition
     * The scale to apply on this track to work at normal speed in relation with other tracks
(mostly used to adjust video speed when the audio length differs).
     *
     */
    0x23314f: {
        name: 'TrackTimestampScale',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackTimestampScale',
        id: '0x23314F',
        type: 'float',
        maxver: '3',
        range: '> 0x0p+0',
        default: '0x1p+0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TrackOffset
     * @definition
     * A value to add to the Block's Timestamp, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks).
This can be used to adjust the playback offset of a track.
     *
     */
    0x537f: {
        name: 'TrackOffset',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackOffset',
        id: '0x537F',
        type: 'integer',
        minver: '0',
        maxver: '0',
        default: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.MaxBlockAdditionID
     * @definition
     * The maximum value of BlockAddID ((#blockaddid-element)).
A value of 0 means there is no BlockAdditions ((#blockadditions-element)) for this track.
     *
     */
    0x55ee: {
        name: 'MaxBlockAdditionID',
        path: '\\Segment\\Tracks\\TrackEntry\\MaxBlockAdditionID',
        id: '0x55EE',
        type: 'uinteger',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.BlockAdditionMapping
     * @definition
     * Contains elements that extend the track format by adding content either to each frame,
with BlockAddID ((#blockaddid-element)), or to the track as a whole
with BlockAddIDExtraData.
     *
     */
    0x41e4: {
        name: 'BlockAdditionMapping',
        path: '\\Segment\\Tracks\\TrackEntry\\BlockAdditionMapping',
        id: '0x41E4',
        type: 'master',
        minver: '4'
    },
    /**
     * @type MatroskaElements.BlockAddIDValue
     * @definition
     * If the track format extension needs content beside frames,
the value refers to the BlockAddID ((#blockaddid-element)) value being described.
     *
     * @usage notes
     * To keep MaxBlockAdditionID as low as possible, small values **SHOULD** be used.
     *
     */
    0x41f0: {
        name: 'BlockAddIDValue',
        path: '\\Segment\\Tracks\\TrackEntry\\BlockAdditionMapping\\BlockAddIDValue',
        id: '0x41F0',
        type: 'uinteger',
        minver: '4',
        range: '>=2',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.BlockAddIDName
     * @definition
     * A human-friendly name describing the type of BlockAdditional data,
as defined by the associated Block Additional Mapping.
     *
     */
    0x41a4: {
        name: 'BlockAddIDName',
        path: '\\Segment\\Tracks\\TrackEntry\\BlockAdditionMapping\\BlockAddIDName',
        id: '0x41A4',
        type: 'string',
        minver: '4',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.BlockAddIDType
     * @definition
     * Stores the registered identifier of the Block Additional Mapping
to define how the BlockAdditional data should be handled.
     *
     * @usage notes
     * If BlockAddIDType is 0, the BlockAddIDValue and corresponding BlockAddID values **MUST** be 1.
     *
     */
    0x41e7: {
        name: 'BlockAddIDType',
        path: '\\Segment\\Tracks\\TrackEntry\\BlockAdditionMapping\\BlockAddIDType',
        id: '0x41E7',
        type: 'uinteger',
        minver: '4',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.BlockAddIDExtraData
     * @definition
     * Extra binary data that the BlockAddIDType can use to interpret the BlockAdditional data.
The interpretation of the binary data depends on the BlockAddIDType value and the corresponding Block Additional Mapping.
     *
     */
    0x41ed: {
        name: 'BlockAddIDExtraData',
        path: '\\Segment\\Tracks\\TrackEntry\\BlockAdditionMapping\\BlockAddIDExtraData',
        id: '0x41ED',
        type: 'binary',
        minver: '4',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.Name
     * @definition
     * A human-readable track name.
     *
     */
    0x536e: {
        name: 'Name',
        path: '\\Segment\\Tracks\\TrackEntry\\Name',
        id: '0x536E',
        type: 'utf-8',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.Language
     * @definition
     * The language of the track,
in the Matroska languages form; see (#language-codes) on language codes.
This Element **MUST** be ignored if the LanguageBCP47 Element is used in the same TrackEntry.
     *
     */
    0x22b59c: {
        name: 'Language',
        path: '\\Segment\\Tracks\\TrackEntry\\Language',
        id: '0x22B59C',
        type: 'string',
        default: 'eng',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.LanguageBCP47
     * @definition
     * The language of the track,
in the form defined in [@!RFC5646]; see (#language-codes) on language codes.
If this Element is used, then any Language Elements used in the same TrackEntry **MUST** be ignored.
     *
     */
    0x22b59d: {
        name: 'LanguageBCP47',
        path: '\\Segment\\Tracks\\TrackEntry\\LanguageBCP47',
        id: '0x22B59D',
        type: 'string',
        minver: '4',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.CodecID
     * @definition
     * An ID corresponding to the codec;
see [@?I-D.ietf-cellar-codec] for more info.
     *
     */
    0x86: {
        name: 'CodecID',
        path: '\\Segment\\Tracks\\TrackEntry\\CodecID',
        id: '0x86',
        type: 'string',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.CodecPrivate
     * @definition
     * Private data only known to the codec.
     *
     */
    0x63a2: {
        name: 'CodecPrivate',
        path: '\\Segment\\Tracks\\TrackEntry\\CodecPrivate',
        id: '0x63A2',
        type: 'binary',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.CodecName
     * @definition
     * A human-readable string specifying the codec.
     *
     */
    0x258688: {
        name: 'CodecName',
        path: '\\Segment\\Tracks\\TrackEntry\\CodecName',
        id: '0x258688',
        type: 'utf-8',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.AttachmentLink
     * @definition
     * The UID of an attachment that is used by this codec.
     *
     * @usage notes
     * The value **MUST** match the `FileUID` value of an attachment found in this Segment.
     *
     */
    0x7446: {
        name: 'AttachmentLink',
        path: '\\Segment\\Tracks\\TrackEntry\\AttachmentLink',
        id: '0x7446',
        type: 'uinteger',
        maxver: '3',
        range: 'not 0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.CodecSettings
     * @definition
     * A string describing the encoding setting used.
     *
     */
    0x3a9697: {
        name: 'CodecSettings',
        path: '\\Segment\\Tracks\\TrackEntry\\CodecSettings',
        id: '0x3A9697',
        type: 'utf-8',
        minver: '0',
        maxver: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.CodecInfoURL
     * @definition
     * A URL to find information about the codec used.
     *
     */
    0x3b4040: {
        name: 'CodecInfoURL',
        path: '\\Segment\\Tracks\\TrackEntry\\CodecInfoURL',
        id: '0x3B4040',
        type: 'string',
        minver: '0',
        maxver: '0'
    },
    /**
     * @type MatroskaElements.CodecDownloadURL
     * @definition
     * A URL to download about the codec used.
     *
     */
    0x26b240: {
        name: 'CodecDownloadURL',
        path: '\\Segment\\Tracks\\TrackEntry\\CodecDownloadURL',
        id: '0x26B240',
        type: 'string',
        minver: '0',
        maxver: '0'
    },
    /**
     * @type MatroskaElements.CodecDecodeAll
     * @definition
     * Set to 1 if the codec can decode potentially damaged data.
     *
     */
    0xaa: {
        name: 'CodecDecodeAll',
        path: '\\Segment\\Tracks\\TrackEntry\\CodecDecodeAll',
        id: '0xAA',
        type: 'uinteger',
        maxver: '0',
        range: '0-1',
        default: '1',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TrackOverlay
     * @definition
     * Specify that this track is an overlay track for the Track specified (in the u-integer).
This means that when this track has a gap on SilentTracks,
the overlay track should be used instead. The order of multiple TrackOverlay matters; the first one is the one that should be used.
If the first one is not found, it should be the second, etc.
     *
     */
    0x6fab: {
        name: 'TrackOverlay',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackOverlay',
        id: '0x6FAB',
        type: 'uinteger',
        maxver: '0'
    },
    /**
     * @type MatroskaElements.CodecDelay
     * @definition
     * The built-in delay for the codec, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks).
It represents the number of codec samples that will be discarded by the decoder during playback.
This timestamp value **MUST** be subtracted from each frame timestamp in order to get the timestamp that will be actually played.
The value **SHOULD** be small so the muxing of tracks with the same actual timestamp are in the same Cluster.
     *
     */
    0x56aa: {
        name: 'CodecDelay',
        path: '\\Segment\\Tracks\\TrackEntry\\CodecDelay',
        id: '0x56AA',
        type: 'uinteger',
        minver: '4',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.SeekPreRoll
     * @definition
     * After a discontinuity, the duration of the data
that the decoder **MUST** decode before the decoded data is valid, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks).
     *
     */
    0x56bb: {
        name: 'SeekPreRoll',
        path: '\\Segment\\Tracks\\TrackEntry\\SeekPreRoll',
        id: '0x56BB',
        type: 'uinteger',
        minver: '4',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TrackTranslate
     * @definition
     * The mapping between this `TrackEntry` and a track value in the given Chapter Codec.
     *
     * @rationale
     * Chapter Codec may need to address content in a specific track, but they may not know of the way to identify tracks in Matroska.
This element and its child elements add a way to map the internal tracks known to the Chapter Codec to the track IDs in Matroska.
This allows remuxing a file with Chapter Codec without changing the content of the codec data, just the track mapping.
     *
     */
    0x6624: {
        name: 'TrackTranslate',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackTranslate',
        id: '0x6624',
        type: 'master'
    },
    /**
     * @type MatroskaElements.TrackTranslateTrackID
     * @definition
     * The binary value used to represent this `TrackEntry` in the chapter codec data.
The format depends on the `ChapProcessCodecID` used; see (#chapprocesscodecid-element).
     *
     */
    0x66a5: {
        name: 'TrackTranslateTrackID',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackTranslate\\TrackTranslateTrackID',
        id: '0x66A5',
        type: 'binary',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TrackTranslateCodec
     * @definition
     * This `TrackTranslate` applies to the chapter codec of the given chapter edition(s); see (#chapprocesscodecid-element).
     *
     */
    0x66bf: {
        name: 'TrackTranslateCodec',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackTranslate\\TrackTranslateCodec',
        id: '0x66BF',
        type: 'uinteger',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TrackTranslateEditionUID
     * @definition
     * Specifies a chapter edition UID to which this `TrackTranslate` applies.
     *
     * @usage notes
     * When no `TrackTranslateEditionUID` is specified in the `TrackTranslate`, the `TrackTranslate` applies to all chapter editions found in the Segment using the given `TrackTranslateCodec`.
     *
     */
    0x66fc: {
        name: 'TrackTranslateEditionUID',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackTranslate\\TrackTranslateEditionUID',
        id: '0x66FC',
        type: 'uinteger'
    },
    /**
     * @type MatroskaElements.Video
     * @definition
     * Video settings.
     *
     */
    0xe0: {
        name: 'Video',
        path: '\\Segment\\Tracks\\TrackEntry\\Video',
        id: '0xE0',
        type: 'master',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.FlagInterlaced
     * @definition
     * Specifies whether the video frames in this track are interlaced.
     *
     */
    0x9a: {
        name: 'FlagInterlaced',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\FlagInterlaced',
        id: '0x9A',
        type: 'uinteger',
        minver: '2',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.FieldOrder
     * @definition
     * Specifies the field ordering of video frames in this track.
     *
     * @usage notes
     * If FlagInterlaced is not set to 1, this Element **MUST** be ignored.
     *
     */
    0x9d: {
        name: 'FieldOrder',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\FieldOrder',
        id: '0x9D',
        type: 'uinteger',
        minver: '4',
        default: '2',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.StereoMode
     * @definition
     * Stereo-3D video mode. See (#multi-planar-and-3d-videos) for more details.
     *
     */
    0x53b8: {
        name: 'StereoMode',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\StereoMode',
        id: '0x53B8',
        type: 'uinteger',
        minver: '3',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.AlphaMode
     * @definition
     * Indicates whether the BlockAdditional Element with BlockAddID of "1" contains Alpha data, as defined by the Codec Mapping for the `CodecID`.
Undefined values **SHOULD NOT** be used, as the behavior of known implementations is different (considered either as 0 or 1).
     *
     */
    0x53c0: {
        name: 'AlphaMode',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\AlphaMode',
        id: '0x53C0',
        type: 'uinteger',
        minver: '3',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.OldStereoMode
     * @definition
     * Bogus StereoMode value used in old versions of [@?libmatroska].
     *
     * @usage notes
     * This Element **MUST NOT** be used. It was an incorrect value used in libmatroska up to 0.9.0.
     *
     */
    0x53b9: {
        name: 'OldStereoMode',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\OldStereoMode',
        id: '0x53B9',
        type: 'uinteger',
        maxver: '2',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.PixelWidth
     * @definition
     * Width of the encoded video frames in pixels.
     *
     */
    0xb0: {
        name: 'PixelWidth',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\PixelWidth',
        id: '0xB0',
        type: 'uinteger',
        range: 'not 0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.PixelHeight
     * @definition
     * Height of the encoded video frames in pixels.
     *
     */
    0xba: {
        name: 'PixelHeight',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\PixelHeight',
        id: '0xBA',
        type: 'uinteger',
        range: 'not 0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.PixelCropBottom
     * @definition
     * The number of video pixels to remove at the bottom of the image.
     *
     */
    0x54aa: {
        name: 'PixelCropBottom',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\PixelCropBottom',
        id: '0x54AA',
        type: 'uinteger',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.PixelCropTop
     * @definition
     * The number of video pixels to remove at the top of the image.
     *
     */
    0x54bb: {
        name: 'PixelCropTop',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\PixelCropTop',
        id: '0x54BB',
        type: 'uinteger',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.PixelCropLeft
     * @definition
     * The number of video pixels to remove on the left of the image.
     *
     */
    0x54cc: {
        name: 'PixelCropLeft',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\PixelCropLeft',
        id: '0x54CC',
        type: 'uinteger',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.PixelCropRight
     * @definition
     * The number of video pixels to remove on the right of the image.
     *
     */
    0x54dd: {
        name: 'PixelCropRight',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\PixelCropRight',
        id: '0x54DD',
        type: 'uinteger',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.DisplayWidth
     * @definition
     * Width of the video frames to display. Applies to the video frame after cropping (PixelCrop* Elements).
     *
     */
    0x54b0: {
        name: 'DisplayWidth',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\DisplayWidth',
        id: '0x54B0',
        type: 'uinteger',
        range: 'not 0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.DisplayHeight
     * @definition
     * Height of the video frames to display. Applies to the video frame after cropping (PixelCrop* Elements).
     *
     */
    0x54ba: {
        name: 'DisplayHeight',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\DisplayHeight',
        id: '0x54BA',
        type: 'uinteger',
        range: 'not 0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.DisplayUnit
     * @definition
     * How DisplayWidth and DisplayHeight are interpreted.
     *
     */
    0x54b2: {
        name: 'DisplayUnit',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\DisplayUnit',
        id: '0x54B2',
        type: 'uinteger',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.AspectRatioType
     * @definition
     * Specifies the possible modifications to the aspect ratio.
     *
     */
    0x54b3: {
        name: 'AspectRatioType',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\AspectRatioType',
        id: '0x54B3',
        type: 'uinteger',
        minver: '0',
        maxver: '0',
        default: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.UncompressedFourCC
     * @definition
     * Specifies the uncompressed pixel format used for the Track's data as a FourCC.
This value is similar in scope to the biCompression value of AVI's `BITMAPINFO` [@?AVIFormat]. There is neither a definitive list of FourCC values nor an official registry. Some common values for YUV pixel formats can be found at [@?MSYUV8], [@?MSYUV16], and [@?FourCC-YUV]. Some common values for uncompressed RGB pixel formats can be found at [@?MSRGB] and [@?FourCC-RGB].
     *
     */
    0x2eb524: {
        name: 'UncompressedFourCC',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\UncompressedFourCC',
        id: '0x2EB524',
        type: 'binary',
        length: '4',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.GammaValue
     * @definition
     * Gamma value.
     *
     */
    0x2fb523: {
        name: 'GammaValue',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\GammaValue',
        id: '0x2FB523',
        type: 'float',
        minver: '0',
        maxver: '0',
        range: '> 0x0p+0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.FrameRate
     * @definition
     * Number of frames per second. This value is informational only. It is intended for constant frame rate streams and should not be used for a variable frame rate TrackEntry.
     *
     */
    0x2383e3: {
        name: 'FrameRate',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\FrameRate',
        id: '0x2383E3',
        type: 'float',
        minver: '0',
        maxver: '0',
        range: '> 0x0p+0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.Colour
     * @definition
     * Settings describing the color format.
     *
     */
    0x55b0: {
        name: 'Colour',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour',
        id: '0x55B0',
        type: 'master',
        minver: '4',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.MatrixCoefficients
     * @definition
     * The Matrix Coefficients of the video used to derive luma and chroma values from red, green, and blue color primaries.
For clarity, the value and meanings for MatrixCoefficients are adopted from Table 4 of [@!ITU-H.273].
     *
     */
    0x55b1: {
        name: 'MatrixCoefficients',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MatrixCoefficients',
        id: '0x55B1',
        type: 'uinteger',
        minver: '4',
        default: '2',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.BitsPerChannel
     * @definition
     * Number of decoded bits per channel. A value of 0 indicates that the BitsPerChannel is unspecified.
     *
     */
    0x55b2: {
        name: 'BitsPerChannel',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\BitsPerChannel',
        id: '0x55B2',
        type: 'uinteger',
        minver: '4',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChromaSubsamplingHorz
     * @definition
     * The number of pixels to remove in the Cr and Cb channels for every pixel not removed horizontally.
Example: For video with 4:2:0 chroma subsampling, the ChromaSubsamplingHorz **SHOULD** be set to 1.
     *
     */
    0x55b3: {
        name: 'ChromaSubsamplingHorz',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\ChromaSubsamplingHorz',
        id: '0x55B3',
        type: 'uinteger',
        minver: '4',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChromaSubsamplingVert
     * @definition
     * The number of pixels to remove in the Cr and Cb channels for every pixel not removed vertically.
Example: For video with 4:2:0 chroma subsampling, the ChromaSubsamplingVert **SHOULD** be set to 1.
     *
     */
    0x55b4: {
        name: 'ChromaSubsamplingVert',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\ChromaSubsamplingVert',
        id: '0x55B4',
        type: 'uinteger',
        minver: '4',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.CbSubsamplingHorz
     * @definition
     * The number of pixels to remove in the Cb channel for every pixel not removed horizontally.
This is additive with ChromaSubsamplingHorz. Example: For video with 4:2:1 chroma subsampling,
the ChromaSubsamplingHorz **SHOULD** be set to 1, and CbSubsamplingHorz **SHOULD** be set to 1.
     *
     */
    0x55b5: {
        name: 'CbSubsamplingHorz',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\CbSubsamplingHorz',
        id: '0x55B5',
        type: 'uinteger',
        minver: '4',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.CbSubsamplingVert
     * @definition
     * The number of pixels to remove in the Cb channel for every pixel not removed vertically.
This is additive with ChromaSubsamplingVert.
     *
     */
    0x55b6: {
        name: 'CbSubsamplingVert',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\CbSubsamplingVert',
        id: '0x55B6',
        type: 'uinteger',
        minver: '4',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChromaSitingHorz
     * @definition
     * How chroma is subsampled horizontally.
     *
     */
    0x55b7: {
        name: 'ChromaSitingHorz',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\ChromaSitingHorz',
        id: '0x55B7',
        type: 'uinteger',
        minver: '4',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChromaSitingVert
     * @definition
     * How chroma is subsampled vertically.
     *
     */
    0x55b8: {
        name: 'ChromaSitingVert',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\ChromaSitingVert',
        id: '0x55B8',
        type: 'uinteger',
        minver: '4',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.Range
     * @definition
     * Clipping of the color ranges.
     *
     */
    0x55b9: {
        name: 'Range',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\Range',
        id: '0x55B9',
        type: 'uinteger',
        minver: '4',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TransferCharacteristics
     * @definition
     * The transfer characteristics of the video. For clarity,
the value and meanings for TransferCharacteristics are adopted from Table 3 of [@!ITU-H.273].
     *
     */
    0x55ba: {
        name: 'TransferCharacteristics',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\TransferCharacteristics',
        id: '0x55BA',
        type: 'uinteger',
        minver: '4',
        default: '2',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.Primaries
     * @definition
     * The color primaries of the video. For clarity,
the value and meanings for Primaries are adopted from Table 2 of [@!ITU-H.273].
     *
     */
    0x55bb: {
        name: 'Primaries',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\Primaries',
        id: '0x55BB',
        type: 'uinteger',
        minver: '4',
        default: '2',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.MaxCLL
     * @definition
     * Maximum brightness of a single pixel (Maximum Content Light Level)
in candelas per square meter (cd/m^2^).
     *
     */
    0x55bc: {
        name: 'MaxCLL',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MaxCLL',
        id: '0x55BC',
        type: 'uinteger',
        minver: '4',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.MaxFALL
     * @definition
     * Maximum brightness of a single full frame (Maximum Frame-Average Light Level)
in candelas per square meter (cd/m^2^).
     *
     */
    0x55bd: {
        name: 'MaxFALL',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MaxFALL',
        id: '0x55BD',
        type: 'uinteger',
        minver: '4',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.MasteringMetadata
     * @definition
     * SMPTE 2086 mastering data.
     *
     */
    0x55d0: {
        name: 'MasteringMetadata',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata',
        id: '0x55D0',
        type: 'master',
        minver: '4',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.PrimaryRChromaticityX
     * @definition
     * Red X chromaticity coordinate, as defined by [@!CIE-1931].
     *
     */
    0x55d1: {
        name: 'PrimaryRChromaticityX',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata\\PrimaryRChromaticityX',
        id: '0x55D1',
        type: 'float',
        minver: '4',
        range: '0x0p+0-0x1p+0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.PrimaryRChromaticityY
     * @definition
     * Red Y chromaticity coordinate, as defined by [@!CIE-1931].
     *
     */
    0x55d2: {
        name: 'PrimaryRChromaticityY',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata\\PrimaryRChromaticityY',
        id: '0x55D2',
        type: 'float',
        minver: '4',
        range: '0x0p+0-0x1p+0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.PrimaryGChromaticityX
     * @definition
     * Green X chromaticity coordinate, as defined by [@!CIE-1931].
     *
     */
    0x55d3: {
        name: 'PrimaryGChromaticityX',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata\\PrimaryGChromaticityX',
        id: '0x55D3',
        type: 'float',
        minver: '4',
        range: '0x0p+0-0x1p+0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.PrimaryGChromaticityY
     * @definition
     * Green Y chromaticity coordinate, as defined by [@!CIE-1931].
     *
     */
    0x55d4: {
        name: 'PrimaryGChromaticityY',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata\\PrimaryGChromaticityY',
        id: '0x55D4',
        type: 'float',
        minver: '4',
        range: '0x0p+0-0x1p+0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.PrimaryBChromaticityX
     * @definition
     * Blue X chromaticity coordinate, as defined by [@!CIE-1931].
     *
     */
    0x55d5: {
        name: 'PrimaryBChromaticityX',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata\\PrimaryBChromaticityX',
        id: '0x55D5',
        type: 'float',
        minver: '4',
        range: '0x0p+0-0x1p+0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.PrimaryBChromaticityY
     * @definition
     * Blue Y chromaticity coordinate, as defined by [@!CIE-1931].
     *
     */
    0x55d6: {
        name: 'PrimaryBChromaticityY',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata\\PrimaryBChromaticityY',
        id: '0x55D6',
        type: 'float',
        minver: '4',
        range: '0x0p+0-0x1p+0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.WhitePointChromaticityX
     * @definition
     * White X chromaticity coordinate, as defined by [@!CIE-1931].
     *
     */
    0x55d7: {
        name: 'WhitePointChromaticityX',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata\\WhitePointChromaticityX',
        id: '0x55D7',
        type: 'float',
        minver: '4',
        range: '0x0p+0-0x1p+0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.WhitePointChromaticityY
     * @definition
     * White Y chromaticity coordinate, as defined by [@!CIE-1931].
     *
     */
    0x55d8: {
        name: 'WhitePointChromaticityY',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata\\WhitePointChromaticityY',
        id: '0x55D8',
        type: 'float',
        minver: '4',
        range: '0x0p+0-0x1p+0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.LuminanceMax
     * @definition
     * Maximum luminance. Represented in candelas per square meter (cd/m^2^).
     *
     */
    0x55d9: {
        name: 'LuminanceMax',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata\\LuminanceMax',
        id: '0x55D9',
        type: 'float',
        minver: '4',
        range: '>= 0x0p+0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.LuminanceMin
     * @definition
     * Minimum luminance. Represented in candelas per square meter (cd/m^2^).
     *
     */
    0x55da: {
        name: 'LuminanceMin',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata\\LuminanceMin',
        id: '0x55DA',
        type: 'float',
        minver: '4',
        range: '>= 0x0p+0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.Projection
     * @definition
     * Describes the video projection details. Used to render spherical or VR videos or to flip videos horizontally or vertically.
     *
     */
    0x7670: {
        name: 'Projection',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Projection',
        id: '0x7670',
        type: 'master',
        minver: '4',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ProjectionType
     * @definition
     * Describes the projection used for this video track.
     *
     */
    0x7671: {
        name: 'ProjectionType',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Projection\\ProjectionType',
        id: '0x7671',
        type: 'uinteger',
        minver: '4',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ProjectionPrivate
     * @definition
     * Private data that only applies to a specific projection.
*  If `ProjectionType` equals 0 (rectangular),
     then this element **MUST NOT** be present.
*  If `ProjectionType` equals 1 (equirectangular), then this element **MUST** be present and contain the same binary data that would be stored inside
      an ISOBMFF Equirectangular Projection Box ("equi").
*  If `ProjectionType` equals 2 (cubemap), then this element **MUST** be present and contain the same binary data that would be stored
      inside an ISOBMFF Cubemap Projection Box ("cbmp").
*  If `ProjectionType` equals 3 (mesh), then this element **MUST** be present and contain the same binary data that would be stored inside
       an ISOBMFF Mesh Projection Box ("mshp").
     *
     * @usage notes
     * ISOBMFF box size and fourcc fields are not included in the binary data,
but the FullBox version and flag fields are. This is to avoid
redundant framing information while preserving versioning and semantics between the two container formats.
     *
     */
    0x7672: {
        name: 'ProjectionPrivate',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Projection\\ProjectionPrivate',
        id: '0x7672',
        type: 'binary',
        minver: '4',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ProjectionPoseYaw
     * @definition
     * Specifies a yaw rotation to the projection.

Value represents a clockwise rotation, in degrees, around the up vector. This rotation must be applied
before any `ProjectionPosePitch` or `ProjectionPoseRoll` rotations.
The value of this element **MUST** be in the -180 to 180 degree range, both included.

Setting `ProjectionPoseYaw` to 180 or -180 degrees with `ProjectionPoseRoll` and `ProjectionPosePitch` set to 0 degrees flips the image horizontally.
     *
     */
    0x7673: {
        name: 'ProjectionPoseYaw',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Projection\\ProjectionPoseYaw',
        id: '0x7673',
        type: 'float',
        range: '>= -0xB4p+0, <= 0xB4p+0',
        minver: '4',
        default: '0x0p+0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ProjectionPosePitch
     * @definition
     * Specifies a pitch rotation to the projection.

Value represents a counter-clockwise rotation, in degrees, around the right vector. This rotation must be applied
after the `ProjectionPoseYaw` rotation and before the `ProjectionPoseRoll` rotation.
The value of this element **MUST** be in the -90 to 90 degree range, both included.
     *
     */
    0x7674: {
        name: 'ProjectionPosePitch',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Projection\\ProjectionPosePitch',
        id: '0x7674',
        type: 'float',
        minver: '4',
        range: '>= -0x5Ap+0, <= 0x5Ap+0',
        default: '0x0p+0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ProjectionPoseRoll
     * @definition
     * Specifies a roll rotation to the projection.

Value represents a counter-clockwise rotation, in degrees, around the forward vector. This rotation must be applied
after the `ProjectionPoseYaw` and `ProjectionPosePitch` rotations.
The value of this element **MUST** be in the -180 to 180 degree range, both included.

Setting `ProjectionPoseRoll` to 180 or -180 degrees and `ProjectionPoseYaw` to 180 or -180 degrees with `ProjectionPosePitch` set to 0 degrees flips the image vertically.

Setting `ProjectionPoseRoll` to 180 or -180 degrees with `ProjectionPoseYaw` and `ProjectionPosePitch` set to 0 degrees flips the image horizontally and vertically.
     *
     */
    0x7675: {
        name: 'ProjectionPoseRoll',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Projection\\ProjectionPoseRoll',
        id: '0x7675',
        type: 'float',
        minver: '4',
        range: '>= -0xB4p+0, <= 0xB4p+0',
        default: '0x0p+0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.Audio
     * @definition
     * Audio settings.
     *
     */
    0xe1: {
        name: 'Audio',
        path: '\\Segment\\Tracks\\TrackEntry\\Audio',
        id: '0xE1',
        type: 'master',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.SamplingFrequency
     * @definition
     * Sampling frequency in Hz.
     *
     */
    0xb5: {
        name: 'SamplingFrequency',
        path: '\\Segment\\Tracks\\TrackEntry\\Audio\\SamplingFrequency',
        id: '0xB5',
        type: 'float',
        range: '> 0x0p+0',
        default: '0x1.f4p+12',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.OutputSamplingFrequency
     * @definition
     * Real output sampling frequency in Hz (used for SBR techniques).
     *
     */
    0x78b5: {
        name: 'OutputSamplingFrequency',
        path: '\\Segment\\Tracks\\TrackEntry\\Audio\\OutputSamplingFrequency',
        id: '0x78B5',
        type: 'float',
        range: '> 0x0p+0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.Channels
     * @definition
     * Numbers of channels in the track.
     *
     */
    0x9f: {
        name: 'Channels',
        path: '\\Segment\\Tracks\\TrackEntry\\Audio\\Channels',
        id: '0x9F',
        type: 'uinteger',
        range: 'not 0',
        default: '1',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChannelPositions
     * @definition
     * Table of horizontal angles for each successive channel.
     *
     */
    0x7d7b: {
        name: 'ChannelPositions',
        path: '\\Segment\\Tracks\\TrackEntry\\Audio\\ChannelPositions',
        id: '0x7D7B',
        type: 'binary',
        minver: '0',
        maxver: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.BitDepth
     * @definition
     * Bits per sample, mostly used for PCM.
     *
     */
    0x6264: {
        name: 'BitDepth',
        path: '\\Segment\\Tracks\\TrackEntry\\Audio\\BitDepth',
        id: '0x6264',
        type: 'uinteger',
        range: 'not 0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.Emphasis
     * @definition
     * Audio emphasis applied on audio samples. The player **MUST** apply the inverse emphasis to get the proper audio samples.
     *
     */
    0x52f1: {
        name: 'Emphasis',
        path: '\\Segment\\Tracks\\TrackEntry\\Audio\\Emphasis',
        id: '0x52F1',
        type: 'uinteger',
        minver: '5',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TrackOperation
     * @definition
     * Operation that needs to be applied on tracks to create this virtual track.
For more details, see (#track-operation).
     *
     */
    0xe2: {
        name: 'TrackOperation',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackOperation',
        id: '0xE2',
        type: 'master',
        minver: '3',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TrackCombinePlanes
     * @definition
     * Contains the list of all video plane tracks that need to be combined to create this 3D track.
     *
     */
    0xe3: {
        name: 'TrackCombinePlanes',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackOperation\\TrackCombinePlanes',
        id: '0xE3',
        type: 'master',
        minver: '3',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TrackPlane
     * @definition
     * Contains a video plane track that needs to be combined to create this 3D track.
     *
     */
    0xe4: {
        name: 'TrackPlane',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackOperation\\TrackCombinePlanes\\TrackPlane',
        id: '0xE4',
        type: 'master',
        minver: '3',
        minOccurs: '1'
    },
    /**
     * @type MatroskaElements.TrackPlaneUID
     * @definition
     * The trackUID number of the track representing the plane.
     *
     */
    0xe5: {
        name: 'TrackPlaneUID',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackOperation\\TrackCombinePlanes\\TrackPlane\\TrackPlaneUID',
        id: '0xE5',
        type: 'uinteger',
        minver: '3',
        range: 'not 0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TrackPlaneType
     * @definition
     * The kind of plane this track corresponds to.
     *
     */
    0xe6: {
        name: 'TrackPlaneType',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackOperation\\TrackCombinePlanes\\TrackPlane\\TrackPlaneType',
        id: '0xE6',
        type: 'uinteger',
        minver: '3',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TrackJoinBlocks
     * @definition
     * Contains the list of all tracks whose Blocks need to be combined to create this virtual track.
     *
     */
    0xe9: {
        name: 'TrackJoinBlocks',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackOperation\\TrackJoinBlocks',
        id: '0xE9',
        type: 'master',
        minver: '3',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TrackJoinUID
     * @definition
     * The trackUID number of a track whose blocks are used to create this virtual track.
     *
     */
    0xed: {
        name: 'TrackJoinUID',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackOperation\\TrackJoinBlocks\\TrackJoinUID',
        id: '0xED',
        type: 'uinteger',
        minver: '3',
        range: 'not 0',
        minOccurs: '1'
    },
    /**
     * @type MatroskaElements.TrickTrackUID
     * @definition
     * The TrackUID of the Smooth FF/RW video in the paired EBML structure corresponding to this video track. See [@?DivXTrickTrack].
     *
     */
    0xc0: {
        name: 'TrickTrackUID',
        path: '\\Segment\\Tracks\\TrackEntry\\TrickTrackUID',
        id: '0xC0',
        type: 'uinteger',
        minver: '0',
        maxver: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TrickTrackSegmentUID
     * @definition
     * The SegmentUID of the Segment containing the track identified by TrickTrackUID. See [@?DivXTrickTrack].
     *
     */
    0xc1: {
        name: 'TrickTrackSegmentUID',
        path: '\\Segment\\Tracks\\TrackEntry\\TrickTrackSegmentUID',
        id: '0xC1',
        type: 'binary',
        minver: '0',
        maxver: '0',
        length: '16',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TrickTrackFlag
     * @definition
     * Set to 1 if this video track is a Smooth FF/RW track. If set to 1, MasterTrackUID and MasterTrackSegUID should be present, and BlockGroups for this track must contain ReferenceFrame structures.
Otherwise, TrickTrackUID and TrickTrackSegUID must be present if this track has a corresponding Smooth FF/RW track. See [@?DivXTrickTrack].
     *
     */
    0xc6: {
        name: 'TrickTrackFlag',
        path: '\\Segment\\Tracks\\TrackEntry\\TrickTrackFlag',
        id: '0xC6',
        type: 'uinteger',
        minver: '0',
        maxver: '0',
        default: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TrickMasterTrackUID
     * @definition
     * The TrackUID of the video track in the paired EBML structure that corresponds to this Smooth FF/RW track. See [@?DivXTrickTrack].
     *
     */
    0xc7: {
        name: 'TrickMasterTrackUID',
        path: '\\Segment\\Tracks\\TrackEntry\\TrickMasterTrackUID',
        id: '0xC7',
        type: 'uinteger',
        minver: '0',
        maxver: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TrickMasterTrackSegmentUID
     * @definition
     * The SegmentUID of the Segment containing the track identified by MasterTrackUID. See [@?DivXTrickTrack].
     *
     */
    0xc4: {
        name: 'TrickMasterTrackSegmentUID',
        path: '\\Segment\\Tracks\\TrackEntry\\TrickMasterTrackSegmentUID',
        id: '0xC4',
        type: 'binary',
        minver: '0',
        maxver: '0',
        length: '16',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ContentEncodings
     * @definition
     * Settings for several content encoding mechanisms like compression or encryption.
     *
     */
    0x6d80: {
        name: 'ContentEncodings',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings',
        id: '0x6D80',
        type: 'master',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ContentEncoding
     * @definition
     * Settings for one content encoding like compression or encryption.
     *
     */
    0x6240: {
        name: 'ContentEncoding',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding',
        id: '0x6240',
        type: 'master',
        minOccurs: '1'
    },
    /**
     * @type MatroskaElements.ContentEncodingOrder
     * @definition
     * Tell in which order to apply each `ContentEncoding` of the `ContentEncodings`.
The decoder/demuxer **MUST** start with the `ContentEncoding` with the highest `ContentEncodingOrder` and work its way down to the `ContentEncoding` with the lowest `ContentEncodingOrder`.
This value **MUST** be unique for each `ContentEncoding` found in the `ContentEncodings` of this `TrackEntry`.
     *
     */
    0x5031: {
        name: 'ContentEncodingOrder',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncodingOrder',
        id: '0x5031',
        type: 'uinteger',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ContentEncodingScope
     * @definition
     * A bit field that describes which Elements have been modified in this way.
Values (big-endian) can be OR'ed.
     *
     */
    0x5032: {
        name: 'ContentEncodingScope',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncodingScope',
        id: '0x5032',
        type: 'uinteger',
        default: '1',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ContentEncodingType
     * @definition
     * A value describing the kind of transformation that is applied.
     *
     */
    0x5033: {
        name: 'ContentEncodingType',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncodingType',
        id: '0x5033',
        type: 'uinteger',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ContentCompression
     * @definition
     * Settings describing the compression used.
This Element **MUST** be present if the value of ContentEncodingType is 0 and absent otherwise.
Each block **MUST** be decompressable, even if no previous block is available in order to not prevent seeking.
     *
     */
    0x5034: {
        name: 'ContentCompression',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentCompression',
        id: '0x5034',
        type: 'master',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ContentCompAlgo
     * @definition
     * The compression algorithm used.
     *
     * @usage notes
     * Compression method "1" (bzlib) and "2" (lzo1x) lack proper documentation on the format, which limits implementation possibilities.
Due to licensing conflicts on commonly available libraries' compression methods, "2" (lzo1x) does not offer widespread interoperability.
A Matroska Writer **SHOULD NOT** use these compression methods by default.
A Matroska Reader **MAY** support methods "1" and "2" as possible and **SHOULD** support other methods.
     *
     */
    0x4254: {
        name: 'ContentCompAlgo',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentCompression\\ContentCompAlgo',
        id: '0x4254',
        type: 'uinteger',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ContentCompSettings
     * @definition
     * Settings that might be needed by the decompressor. For Header Stripping (`ContentCompAlgo`=3),
the bytes that were removed from the beginning of each frame of the track.
     *
     */
    0x4255: {
        name: 'ContentCompSettings',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentCompression\\ContentCompSettings',
        id: '0x4255',
        type: 'binary',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ContentEncryption
     * @definition
     * Settings describing the encryption used.
This Element **MUST** be present if the value of `ContentEncodingType` is 1 (encryption) and **MUST** be ignored otherwise.
A Matroska Player **MAY** support encryption.
     *
     */
    0x5035: {
        name: 'ContentEncryption',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncryption',
        id: '0x5035',
        type: 'master',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ContentEncAlgo
     * @definition
     * The encryption algorithm used.
     *
     */
    0x47e1: {
        name: 'ContentEncAlgo',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncryption\\ContentEncAlgo',
        id: '0x47E1',
        type: 'uinteger',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ContentEncKeyID
     * @definition
     * For public key algorithms, the ID of the public key that the data was encrypted with.
     *
     */
    0x47e2: {
        name: 'ContentEncKeyID',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncryption\\ContentEncKeyID',
        id: '0x47E2',
        type: 'binary',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ContentEncAESSettings
     * @definition
     * Settings describing the encryption algorithm used.
     *
     */
    0x47e7: {
        name: 'ContentEncAESSettings',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncryption\\ContentEncAESSettings',
        id: '0x47E7',
        type: 'master',
        minver: '4',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.AESSettingsCipherMode
     * @definition
     * The AES cipher mode used in the encryption.
     *
     */
    0x47e8: {
        name: 'AESSettingsCipherMode',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncryption\\ContentEncAESSettings\\AESSettingsCipherMode',
        id: '0x47E8',
        type: 'uinteger',
        minver: '4',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ContentSignature
     * @definition
     * A cryptographic signature of the contents.
     *
     */
    0x47e3: {
        name: 'ContentSignature',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncryption\\ContentSignature',
        id: '0x47E3',
        type: 'binary',
        maxver: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ContentSigKeyID
     * @definition
     * This is the ID of the private key that the data was signed with.
     *
     */
    0x47e4: {
        name: 'ContentSigKeyID',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncryption\\ContentSigKeyID',
        id: '0x47E4',
        type: 'binary',
        maxver: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ContentSigAlgo
     * @definition
     * The algorithm used for the signature.
     *
     */
    0x47e5: {
        name: 'ContentSigAlgo',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncryption\\ContentSigAlgo',
        id: '0x47E5',
        type: 'uinteger',
        maxver: '0',
        default: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ContentSigHashAlgo
     * @definition
     * The hash algorithm used for the signature.
     *
     */
    0x47e6: {
        name: 'ContentSigHashAlgo',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncryption\\ContentSigHashAlgo',
        id: '0x47E6',
        type: 'uinteger',
        maxver: '0',
        default: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.Cues
     * @definition
     * A Top-Level Element to speed seeking access.
All entries are local to the Segment.
     *
     */
    0x1c53bb6b: {
        name: 'Cues',
        path: '\\Segment\\Cues',
        id: '0x1C53BB6B',
        type: 'master',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.CuePoint
     * @definition
     * Contains all information relative to a seek point in the Segment.
     *
     */
    0xbb: {
        name: 'CuePoint',
        path: '\\Segment\\Cues\\CuePoint',
        id: '0xBB',
        type: 'master',
        minOccurs: '1'
    },
    /**
     * @type MatroskaElements.CueTime
     * @definition
     * Absolute timestamp of the seek point, expressed in Segment Ticks, which are based on TimestampScale; see (#timestamp-ticks).
     *
     */
    0xb3: {
        name: 'CueTime',
        path: '\\Segment\\Cues\\CuePoint\\CueTime',
        id: '0xB3',
        type: 'uinteger',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.CueTrackPositions
     * @definition
     * Contains positions for different tracks corresponding to the timestamp.
     *
     */
    0xb7: {
        name: 'CueTrackPositions',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions',
        id: '0xB7',
        type: 'master',
        minOccurs: '1'
    },
    /**
     * @type MatroskaElements.CueTrack
     * @definition
     * The track for which a position is given.
     *
     */
    0xf7: {
        name: 'CueTrack',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueTrack',
        id: '0xF7',
        type: 'uinteger',
        range: 'not 0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.CueClusterPosition
     * @definition
     * The Segment Position ((#segment-position)) of the Cluster containing the associated Block.
     *
     */
    0xf1: {
        name: 'CueClusterPosition',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueClusterPosition',
        id: '0xF1',
        type: 'uinteger',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.CueRelativePosition
     * @definition
     * The relative position inside the Cluster of the referenced SimpleBlock or BlockGroup
with 0 being the first possible position for an Element inside that Cluster.
     *
     */
    0xf0: {
        name: 'CueRelativePosition',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueRelativePosition',
        id: '0xF0',
        type: 'uinteger',
        minver: '4',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.CueDuration
     * @definition
     * The duration of the block, expressed in Segment Ticks, which are based on TimestampScale; see (#timestamp-ticks).
If missing, the track's DefaultDuration does not apply and no duration information is available in terms of the cues.
     *
     */
    0xb2: {
        name: 'CueDuration',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueDuration',
        id: '0xB2',
        type: 'uinteger',
        minver: '4',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.CueBlockNumber
     * @definition
     * Number of the Block in the specified Cluster.
     *
     */
    0x5378: {
        name: 'CueBlockNumber',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueBlockNumber',
        id: '0x5378',
        type: 'uinteger',
        range: 'not 0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.CueCodecState
     * @definition
     * The Segment Position ((#segment-position)) of the Codec State corresponding to this Cue Element.
0 means that the data is taken from the initial Track Entry.
     *
     */
    0xea: {
        name: 'CueCodecState',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueCodecState',
        id: '0xEA',
        type: 'uinteger',
        minver: '2',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.CueReference
     * @definition
     * The Clusters containing the referenced Blocks.
     *
     */
    0xdb: {
        name: 'CueReference',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueReference',
        id: '0xDB',
        type: 'master',
        minver: '2'
    },
    /**
     * @type MatroskaElements.CueRefTime
     * @definition
     * Timestamp of the referenced Block, expressed in Segment Ticks which is based on TimestampScale; see (#timestamp-ticks).
     *
     */
    0x96: {
        name: 'CueRefTime',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueReference\\CueRefTime',
        id: '0x96',
        type: 'uinteger',
        minver: '2',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.CueRefCluster
     * @definition
     * The Segment Position of the Cluster containing the referenced Block.
     *
     */
    0x97: {
        name: 'CueRefCluster',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueReference\\CueRefCluster',
        id: '0x97',
        type: 'uinteger',
        minver: '0',
        maxver: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.CueRefNumber
     * @definition
     * Number of the referenced Block of Track X in the specified Cluster.
     *
     */
    0x535f: {
        name: 'CueRefNumber',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueReference\\CueRefNumber',
        id: '0x535F',
        type: 'uinteger',
        minver: '0',
        maxver: '0',
        range: 'not 0',
        default: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.CueRefCodecState
     * @definition
     * The Segment Position of the Codec State corresponding to this referenced Element.
0 means that the data is taken from the initial Track Entry.
     *
     */
    0xeb: {
        name: 'CueRefCodecState',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueReference\\CueRefCodecState',
        id: '0xEB',
        type: 'uinteger',
        minver: '0',
        maxver: '0',
        default: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.Attachments
     * @definition
     * Contains attached files.
     *
     */
    0x1941a469: {
        name: 'Attachments',
        path: '\\Segment\\Attachments',
        id: '0x1941A469',
        type: 'master',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.AttachedFile
     * @definition
     * An attached file.
     *
     */
    0x61a7: {
        name: 'AttachedFile',
        path: '\\Segment\\Attachments\\AttachedFile',
        id: '0x61A7',
        type: 'master',
        minOccurs: '1'
    },
    /**
     * @type MatroskaElements.FileDescription
     * @definition
     * A human-friendly name for the attached file.
     *
     */
    0x467e: {
        name: 'FileDescription',
        path: '\\Segment\\Attachments\\AttachedFile\\FileDescription',
        id: '0x467E',
        type: 'utf-8',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.FileName
     * @definition
     * Filename of the attached file.
     *
     */
    0x466e: {
        name: 'FileName',
        path: '\\Segment\\Attachments\\AttachedFile\\FileName',
        id: '0x466E',
        type: 'utf-8',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.FileMediaType
     * @definition
     * Media type of the file following the format described in [@!RFC6838].
     *
     */
    0x4660: {
        name: 'FileMediaType',
        path: '\\Segment\\Attachments\\AttachedFile\\FileMediaType',
        id: '0x4660',
        type: 'string',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.FileData
     * @definition
     * The data of the file.
     *
     */
    0x465c: {
        name: 'FileData',
        path: '\\Segment\\Attachments\\AttachedFile\\FileData',
        id: '0x465C',
        type: 'binary',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.FileUID
     * @definition
     * UID representing the file, as random as possible.
     *
     */
    0x46ae: {
        name: 'FileUID',
        path: '\\Segment\\Attachments\\AttachedFile\\FileUID',
        id: '0x46AE',
        type: 'uinteger',
        range: 'not 0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.FileReferral
     * @definition
     * A binary value that a track/codec can refer to when the attachment is needed.
     *
     */
    0x4675: {
        name: 'FileReferral',
        path: '\\Segment\\Attachments\\AttachedFile\\FileReferral',
        id: '0x4675',
        type: 'binary',
        minver: '0',
        maxver: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.FileUsedStartTime
     * @definition
     * The timestamp at which this optimized font attachment comes into context, expressed in Segment Ticks, which are based on TimestampScale. See [@?DivXWorldFonts].
     *
     * @usage notes
     * This element is reserved for future use and if written **MUST** be the segment start timestamp.
     *
     */
    0x4661: {
        name: 'FileUsedStartTime',
        path: '\\Segment\\Attachments\\AttachedFile\\FileUsedStartTime',
        id: '0x4661',
        type: 'uinteger',
        minver: '0',
        maxver: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.FileUsedEndTime
     * @definition
     * The timestamp at which this optimized font attachment goes out of context, expressed in Segment Ticks, which are based on TimestampScale. See [@?DivXWorldFonts].
     *
     * @usage notes
     * This element is reserved for future use and if written **MUST** be the segment end timestamp.
     *
     */
    0x4662: {
        name: 'FileUsedEndTime',
        path: '\\Segment\\Attachments\\AttachedFile\\FileUsedEndTime',
        id: '0x4662',
        type: 'uinteger',
        minver: '0',
        maxver: '0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.Chapters
     * @definition
     * A system to define basic menus and partition data.
For more detailed information, see (#chapters).
     *
     */
    0x1043a770: {
        name: 'Chapters',
        path: '\\Segment\\Chapters',
        id: '0x1043A770',
        type: 'master',
        maxOccurs: '1',
        recurring: '1'
    },
    /**
     * @type MatroskaElements.EditionEntry
     * @definition
     * Contains all information about a Segment edition.
     *
     */
    0x45b9: {
        name: 'EditionEntry',
        path: '\\Segment\\Chapters\\EditionEntry',
        id: '0x45B9',
        type: 'master',
        minOccurs: '1'
    },
    /**
     * @type MatroskaElements.EditionUID
     * @definition
     * A UID that identifies the edition. It's useful for tagging an edition.
     *
     */
    0x45bc: {
        name: 'EditionUID',
        path: '\\Segment\\Chapters\\EditionEntry\\EditionUID',
        id: '0x45BC',
        type: 'uinteger',
        range: 'not 0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.EditionFlagHidden
     * @definition
     * Set to 1 if an edition is hidden. Hidden editions **SHOULD NOT** be available to the user interface
(but still to Control Tracks; see (#chapter-flags) on Chapter flags).
     *
     */
    0x45bd: {
        name: 'EditionFlagHidden',
        path: '\\Segment\\Chapters\\EditionEntry\\EditionFlagHidden',
        id: '0x45BD',
        type: 'uinteger',
        range: '0-1',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.EditionFlagDefault
     * @definition
     * Set to 1 if the edition **SHOULD** be used as the default one.
     *
     */
    0x45db: {
        name: 'EditionFlagDefault',
        path: '\\Segment\\Chapters\\EditionEntry\\EditionFlagDefault',
        id: '0x45DB',
        type: 'uinteger',
        range: '0-1',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.EditionFlagOrdered
     * @definition
     * Set to 1 if the chapters can be defined multiple times and the order to play them is enforced; see (#editionflagordered).
     *
     */
    0x45dd: {
        name: 'EditionFlagOrdered',
        path: '\\Segment\\Chapters\\EditionEntry\\EditionFlagOrdered',
        id: '0x45DD',
        type: 'uinteger',
        range: '0-1',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.EditionDisplay
     * @definition
     * Contains a possible string to use for the edition display for the given languages.
     *
     */
    0x4520: {
        name: 'EditionDisplay',
        path: '\\Segment\\Chapters\\EditionEntry\\EditionDisplay',
        id: '0x4520',
        type: 'master',
        minver: '5'
    },
    /**
     * @type MatroskaElements.EditionString
     * @definition
     * Contains the string to use as the edition name.
     *
     */
    0x4521: {
        name: 'EditionString',
        path: '\\Segment\\Chapters\\EditionEntry\\EditionDisplay\\EditionString',
        id: '0x4521',
        type: 'utf-8',
        minver: '5',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.EditionLanguageIETF
     * @definition
     * One language corresponding to the EditionString,
in the form defined in [@!RFC5646]; see (#language-codes) on language codes.
     *
     */
    0x45e4: {
        name: 'EditionLanguageIETF',
        path: '\\Segment\\Chapters\\EditionEntry\\EditionDisplay\\EditionLanguageIETF',
        id: '0x45E4',
        type: 'string',
        minver: '5'
    },
    /**
     * @type MatroskaElements.ChapterAtom
     * @definition
     * Contains the atom information to use as the chapter atom (applies to all tracks).
     *
     */
    0xb6: {
        name: 'ChapterAtom',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom',
        id: '0xB6',
        type: 'master',
        minOccurs: '1',
        recursive: '1'
    },
    /**
     * @type MatroskaElements.ChapterUID
     * @definition
     * A UID that identifies the Chapter.
     *
     */
    0x73c4: {
        name: 'ChapterUID',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterUID',
        id: '0x73C4',
        type: 'uinteger',
        range: 'not 0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChapterStringUID
     * @definition
     * A unique string ID that identifies the Chapter.
For example, it is used as the storage for cue identifier values [@?WebVTT].
     *
     */
    0x5654: {
        name: 'ChapterStringUID',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterStringUID',
        id: '0x5654',
        type: 'utf-8',
        minver: '3',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChapterTimeStart
     * @definition
     * Timestamp of the start of Chapter, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks).
     *
     */
    0x91: {
        name: 'ChapterTimeStart',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterTimeStart',
        id: '0x91',
        type: 'uinteger',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChapterTimeEnd
     * @definition
     * Timestamp of the end of Chapter timestamp excluded, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks).
The value **MUST** be greater than or equal to the `ChapterTimeStart` of the same `ChapterAtom`.
     *
     * @usage notes
     * With the `ChapterTimeEnd` timestamp value being excluded, it **MUST** take into account the duration of
the last frame it includes, especially for the `ChapterAtom` using the last frames of the `Segment`.
     *
     */
    0x92: {
        name: 'ChapterTimeEnd',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterTimeEnd',
        id: '0x92',
        type: 'uinteger',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChapterFlagHidden
     * @definition
     * Set to 1 if a chapter is hidden. Hidden chapters **SHOULD NOT** be available to the user interface
(but still to Control Tracks; see (#chapterflaghidden) on Chapter flags).
     *
     */
    0x98: {
        name: 'ChapterFlagHidden',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterFlagHidden',
        id: '0x98',
        type: 'uinteger',
        range: '0-1',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChapterFlagEnabled
     * @definition
     * Set to 1 if the chapter is enabled. It can be enabled/disabled by a Control Track.
When disabled, the movie **SHOULD** skip all the content between the TimeStart and TimeEnd of this chapter; see (#chapter-flags) on Chapter flags.
     *
     */
    0x4598: {
        name: 'ChapterFlagEnabled',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterFlagEnabled',
        id: '0x4598',
        type: 'uinteger',
        range: '0-1',
        default: '1',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChapterSegmentUUID
     * @definition
     * The SegmentUUID of another Segment to play during this chapter.
     *
     * @usage notes
     * The value **MUST NOT** be the `SegmentUUID` value of the `Segment` it belongs to.
     *
     */
    0x6e67: {
        name: 'ChapterSegmentUUID',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterSegmentUUID',
        id: '0x6E67',
        type: 'binary',
        length: '16',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChapterSkipType
     * @definition
     * Indicates what type of content the ChapterAtom contains and might be skipped. It can be used to automatically skip content based on the type.
If a `ChapterAtom` is inside a `ChapterAtom` that has a `ChapterSkipType` set, it **MUST NOT** have a `ChapterSkipType` or have a `ChapterSkipType` with the same value as it's parent `ChapterAtom`.
If the `ChapterAtom` doesn't contain a `ChapterTimeEnd`, the value of the `ChapterSkipType` is only valid until the next `ChapterAtom` with a `ChapterSkipType` value or the end of the file.
     *
     */
    0x4588: {
        name: 'ChapterSkipType',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterSkipType',
        id: '0x4588',
        type: 'uinteger',
        maxOccurs: '1',
        minver: '5'
    },
    /**
     * @type MatroskaElements.ChapterSegmentEditionUID
     * @definition
     * The EditionUID to play from the Segment linked in ChapterSegmentUUID.
If ChapterSegmentEditionUID is undeclared, then no Edition of the linked Segment is used; see (#medium-linking) on Medium-Linking Segments.
     *
     */
    0x6ebc: {
        name: 'ChapterSegmentEditionUID',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterSegmentEditionUID',
        id: '0x6EBC',
        type: 'uinteger',
        range: 'not 0',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChapterPhysicalEquiv
     * @definition
     * Specifies the physical equivalent of this ChapterAtom, e.g., "DVD" (60) or "SIDE" (50);
see (#physical-types) for a complete list of values.
     *
     */
    0x63c3: {
        name: 'ChapterPhysicalEquiv',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterPhysicalEquiv',
        id: '0x63C3',
        type: 'uinteger',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChapterTrack
     * @definition
     * List of tracks on which the chapter applies. If this Element is not present, all tracks apply.
     *
     */
    0x8f: {
        name: 'ChapterTrack',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterTrack',
        id: '0x8F',
        type: 'master',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChapterTrackUID
     * @definition
     * UID of the Track to apply this chapter to.
In the absence of a control track, choosing this chapter will select the listed Tracks and deselect unlisted tracks.
Absence of this Element indicates that the Chapter **SHOULD** be applied to any currently used Tracks.
     *
     */
    0x89: {
        name: 'ChapterTrackUID',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterTrack\\ChapterTrackUID',
        id: '0x89',
        type: 'uinteger',
        range: 'not 0',
        minOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChapterDisplay
     * @definition
     * Contains all possible strings to use for the chapter display.
     *
     */
    0x80: {
        name: 'ChapterDisplay',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterDisplay',
        id: '0x80',
        type: 'master'
    },
    /**
     * @type MatroskaElements.ChapString
     * @definition
     * Contains the string to use as the chapter atom.
     *
     */
    0x85: {
        name: 'ChapString',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterDisplay\\ChapString',
        id: '0x85',
        type: 'utf-8',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChapLanguage
     * @definition
     * A language corresponding to the string,
in the Matroska languages form; see (#language-codes) on language codes.
This Element **MUST** be ignored if a ChapLanguageBCP47 Element is used within the same ChapterDisplay Element.
     *
     */
    0x437c: {
        name: 'ChapLanguage',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterDisplay\\ChapLanguage',
        id: '0x437C',
        type: 'string',
        default: 'eng',
        minOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChapLanguageBCP47
     * @definition
     * A language corresponding to the ChapString,
in the form defined in [@!RFC5646]; see (#language-codes) on language codes.
If a ChapLanguageBCP47 Element is used, then any ChapLanguage and ChapCountry Elements used in the same ChapterDisplay **MUST** be ignored.
     *
     */
    0x437d: {
        name: 'ChapLanguageBCP47',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterDisplay\\ChapLanguageBCP47',
        id: '0x437D',
        type: 'string',
        minver: '4'
    },
    /**
     * @type MatroskaElements.ChapCountry
     * @definition
     * A country corresponding to the string,
in the Matroska countries form; see (#country-codes) on country codes.
This Element **MUST** be ignored if a ChapLanguageBCP47 Element is used within the same ChapterDisplay Element.
     *
     */
    0x437e: {
        name: 'ChapCountry',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterDisplay\\ChapCountry',
        id: '0x437E',
        type: 'string'
    },
    /**
     * @type MatroskaElements.ChapProcess
     * @definition
     * Contains all the commands associated with the Atom.
     *
     */
    0x6944: {
        name: 'ChapProcess',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapProcess',
        id: '0x6944',
        type: 'master'
    },
    /**
     * @type MatroskaElements.ChapProcessCodecID
     * @definition
     * Contains the type of the codec used for processing.
A value of 0 means built-in Matroska processing (to be defined), and a value of 1 means the DVD command set is used; see (#menu-features) on DVD menus.
More codec IDs can be added later.
     *
     */
    0x6955: {
        name: 'ChapProcessCodecID',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapProcess\\ChapProcessCodecID',
        id: '0x6955',
        type: 'uinteger',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChapProcessPrivate
     * @definition
     * Optional data attached to the ChapProcessCodecID information.
    For ChapProcessCodecID = 1, it is the "DVD level" equivalent; see (#menu-features) on DVD menus.
     *
     */
    0x450d: {
        name: 'ChapProcessPrivate',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapProcess\\ChapProcessPrivate',
        id: '0x450D',
        type: 'binary',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChapProcessCommand
     * @definition
     * Contains all the commands associated with the Atom.
     *
     */
    0x6911: {
        name: 'ChapProcessCommand',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapProcess\\ChapProcessCommand',
        id: '0x6911',
        type: 'master'
    },
    /**
     * @type MatroskaElements.ChapProcessTime
     * @definition
     * Defines when the process command **SHOULD** be handled.
     *
     */
    0x6922: {
        name: 'ChapProcessTime',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapProcess\\ChapProcessCommand\\ChapProcessTime',
        id: '0x6922',
        type: 'uinteger',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.ChapProcessData
     * @definition
     * Contains the command information.
The data **SHOULD** be interpreted depending on the ChapProcessCodecID value. For ChapProcessCodecID = 1,
the data correspond to the binary DVD cell pre/post commands; see (#menu-features) on DVD menus.
     *
     */
    0x6933: {
        name: 'ChapProcessData',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapProcess\\ChapProcessCommand\\ChapProcessData',
        id: '0x6933',
        type: 'binary',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.Tags
     * @definition
     * Element containing metadata describing Tracks, Editions, Chapters, Attachments, or the Segment as a whole.
A list of valid tags can be found in [@?I-D.ietf-cellar-tags].
     *
     */
    0x1254c367: { name: 'Tags', path: '\\Segment\\Tags', id: '0x1254C367', type: 'master' },
    /**
     * @type MatroskaElements.Tag
     * @definition
     * A single metadata descriptor.
     *
     */
    0x7373: {
        name: 'Tag',
        path: '\\Segment\\Tags\\Tag',
        id: '0x7373',
        type: 'master',
        minOccurs: '1'
    },
    /**
     * @type MatroskaElements.Targets
     * @definition
     * Specifies which other elements the metadata represented by the Tag applies to.
If empty or omitted, then the Tag describes everything in the Segment.
     *
     */
    0x63c0: {
        name: 'Targets',
        path: '\\Segment\\Tags\\Tag\\Targets',
        id: '0x63C0',
        type: 'master',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TargetTypeValue
     * @definition
     * A number to indicate the logical level of the target.
     *
     */
    0x68ca: {
        name: 'TargetTypeValue',
        path: '\\Segment\\Tags\\Tag\\Targets\\TargetTypeValue',
        id: '0x68CA',
        type: 'uinteger',
        default: '50',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TargetType
     * @definition
     * An informational string that can be used to display the logical level of the target, such as "ALBUM", "TRACK", "MOVIE", "CHAPTER", etc.
     *
     */
    0x63ca: {
        name: 'TargetType',
        path: '\\Segment\\Tags\\Tag\\Targets\\TargetType',
        id: '0x63CA',
        type: 'string',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TagTrackUID
     * @definition
     * A UID that identifies the Track(s) that the tags belong to.
     *
     * @usage notes
     * If the value is 0 at this level, the tags apply to all tracks in the Segment.
If set to any other value, it **MUST** match the `TrackUID` value of a track found in this Segment.
     *
     */
    0x63c5: {
        name: 'TagTrackUID',
        path: '\\Segment\\Tags\\Tag\\Targets\\TagTrackUID',
        id: '0x63C5',
        type: 'uinteger',
        default: '0'
    },
    /**
     * @type MatroskaElements.TagEditionUID
     * @definition
     * A UID that identifies the EditionEntry(s) that the tags belong to.
     *
     * @usage notes
     * If the value is 0 at this level, the tags apply to all editions in the Segment.
If set to any other value, it **MUST** match the `EditionUID` value of an edition found in this Segment.
     *
     */
    0x63c9: {
        name: 'TagEditionUID',
        path: '\\Segment\\Tags\\Tag\\Targets\\TagEditionUID',
        id: '0x63C9',
        type: 'uinteger',
        default: '0'
    },
    /**
     * @type MatroskaElements.TagChapterUID
     * @definition
     * A UID that identifies the Chapter(s) that the tags belong to.
     *
     * @usage notes
     * If the value is 0 at this level, the tags apply to all chapters in the Segment.
If set to any other value, it **MUST** match the `ChapterUID` value of a chapter found in this Segment.
     *
     */
    0x63c4: {
        name: 'TagChapterUID',
        path: '\\Segment\\Tags\\Tag\\Targets\\TagChapterUID',
        id: '0x63C4',
        type: 'uinteger',
        default: '0'
    },
    /**
     * @type MatroskaElements.TagAttachmentUID
     * @definition
     * A UID that identifies the Attachment(s) that the tags belong to.
     *
     * @usage notes
     * If the value is 0 at this level, the tags apply to all the attachments in the Segment.
If set to any other value, it **MUST** match the `FileUID` value of an attachment found in this Segment.
     *
     */
    0x63c6: {
        name: 'TagAttachmentUID',
        path: '\\Segment\\Tags\\Tag\\Targets\\TagAttachmentUID',
        id: '0x63C6',
        type: 'uinteger',
        default: '0'
    },
    /**
     * @type MatroskaElements.SimpleTag
     * @definition
     * Contains general information about the target.
     *
     */
    0x67c8: {
        name: 'SimpleTag',
        path: '\\Segment\\Tags\\Tag\\+SimpleTag',
        id: '0x67C8',
        type: 'master',
        minOccurs: '1',
        recursive: '1'
    },
    /**
     * @type MatroskaElements.TagName
     * @definition
     * The name of the Tag that is going to be stored.
     *
     */
    0x45a3: {
        name: 'TagName',
        path: '\\Segment\\Tags\\Tag\\+SimpleTag\\TagName',
        id: '0x45A3',
        type: 'utf-8',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TagLanguage
     * @definition
     * Specifies the language of the specified tag
in the Matroska languages form; see (#language-codes) on language codes.
This Element **MUST** be ignored if the TagLanguageBCP47 Element is used within the same SimpleTag Element.
     *
     */
    0x447a: {
        name: 'TagLanguage',
        path: '\\Segment\\Tags\\Tag\\+SimpleTag\\TagLanguage',
        id: '0x447A',
        type: 'string',
        default: 'und',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TagLanguageBCP47
     * @definition
     * The language used in the TagString,
in the form defined in [@!RFC5646]; see (#language-codes) on language codes.
If this Element is used, then any TagLanguage Elements used in the same SimpleTag **MUST** be ignored.
     *
     */
    0x447b: {
        name: 'TagLanguageBCP47',
        path: '\\Segment\\Tags\\Tag\\+SimpleTag\\TagLanguageBCP47',
        id: '0x447B',
        type: 'string',
        minver: '4',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TagDefault
     * @definition
     * A boolean value to indicate if this is the default/original language to use for the given tag.
     *
     */
    0x4484: {
        name: 'TagDefault',
        path: '\\Segment\\Tags\\Tag\\+SimpleTag\\TagDefault',
        id: '0x4484',
        type: 'uinteger',
        range: '0-1',
        default: '1',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TagDefaultBogus
     * @definition
     * A variant of the TagDefault element with a bogus Element ID; see (#tagdefault-element).
     *
     */
    0x44b4: {
        name: 'TagDefaultBogus',
        path: '\\Segment\\Tags\\Tag\\+SimpleTag\\TagDefaultBogus',
        id: '0x44B4',
        type: 'uinteger',
        minver: '0',
        maxver: '0',
        range: '0-1',
        default: '1',
        minOccurs: '1',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TagString
     * @definition
     * The value of the Tag.
     *
     */
    0x4487: {
        name: 'TagString',
        path: '\\Segment\\Tags\\Tag\\+SimpleTag\\TagString',
        id: '0x4487',
        type: 'utf-8',
        maxOccurs: '1'
    },
    /**
     * @type MatroskaElements.TagBinary
     * @definition
     * The values of the Tag if it is binary. Note that this cannot be used in the same SimpleTag as TagString.
     *
     */
    0x4485: {
        name: 'TagBinary',
        path: '\\Segment\\Tags\\Tag\\+SimpleTag\\TagBinary',
        id: '0x4485',
        type: 'binary',
        maxOccurs: '1'
    }
};
