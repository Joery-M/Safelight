/* eslint-disable prettier/prettier */
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
    /**
     * @interface {@link Elements.EBMLMaxIDLength}
     * @default 4
     * @range 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x42F2
     */
    EBMLMaxIDLength = 0x42f2,
    /**
     * @interface {@link Elements.EBMLMaxSizeLength}
     * @default 8
     * @range 1-8
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x42F3
     */
    EBMLMaxSizeLength = 0x42f3,
    /**
     * @interface {@link Elements.Segment}
     * @definition
     * The `Root Element` that contains all other `Top-Level Elements`; see (#data-layout).
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x18538067
     */
    Segment = 0x18538067,
    /**
     * @interface {@link Elements.SeekHead}
     * @definition
     * Contains seeking information of `Top-Level Elements`; see (#data-layout).
     *
     * @maxOccurs 2
     * @id 0x114D9B74
     */
    SeekHead = 0x114d9b74,
    /**
     * @interface {@link Elements.Seek}
     * @definition
     * Contains a single seek entry to an EBML Element.
     *
     * @minOccurs 1
     * @id 0x4DBB
     */
    Seek = 0x4dbb,
    /**
     * @interface {@link Elements.SeekID}
     * @definition
     * The binary EBML ID of a `Top-Level Element`.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x53AB
     */
    SeekID = 0x53ab,
    /**
     * @interface {@link Elements.SeekPosition}
     * @definition
     * The `Segment Position` ((#segment-position)) of a `Top-Level Element`.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x53AC
     */
    SeekPosition = 0x53ac,
    /**
     * @interface {@link Elements.Info}
     * @definition
     * Contains general information about the `Segment`.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x1549A966
     */
    Info = 0x1549a966,
    /**
     * @interface {@link Elements.SegmentUUID}
     * @definition
     * A randomly generated UID that identifies the `Segment` amongst many others (128 bits). It is equivalent to a Universally Unique Identifier (UUID) v4 [@!RFC4122] with all bits randomly (or pseudorandomly) chosen.  An actual UUID v4 value, where some bits are not random, **MAY** also be used.
     *
     * @usage notes
     * If the `Segment` is a part of a `Linked Segment`, then this element is **REQUIRED**.
     * The value of the UID **MUST** contain at least one bit set to 1.
     *
     * @maxOccurs 1
     * @id 0x73A4
     */
    SegmentUUID = 0x73a4,
    /**
     * @interface {@link Elements.SegmentFilename}
     * @definition
     * A filename corresponding to this `Segment`.
     *
     * @maxOccurs 1
     * @id 0x7384
     */
    SegmentFilename = 0x7384,
    /**
     * @interface {@link Elements.PrevUUID}
     * @definition
     * An ID that identifies the previous `Segment` of a `Linked Segment`.
     *
     * @usage notes
     * If the `Segment` is a part of a `Linked Segment` that uses
     * Hard Linking ((#hard-linking)),
     * then either the `PrevUUID` or the `NextUUID` element is **REQUIRED**. If a `Segment` contains a `PrevUUID` but not a `NextUUID`,
     * then it **MAY** be considered as the last `Segment` of the `Linked Segment`. The `PrevUUID` **MUST NOT** be equal to the `SegmentUUID`.
     *
     * @maxOccurs 1
     * @id 0x3CB923
     */
    PrevUUID = 0x3cb923,
    /**
     * @interface {@link Elements.PrevFilename}
     * @definition
     * A filename corresponding to the file of the previous `Linked Segment`.
     *
     * @usage notes
     * Provision of the previous filename is for display convenience,
     * but `PrevUUID` **SHOULD** be considered authoritative for identifying the previous `Segment` in a `Linked Segment`.
     *
     * @maxOccurs 1
     * @id 0x3C83AB
     */
    PrevFilename = 0x3c83ab,
    /**
     * @interface {@link Elements.NextUUID}
     * @definition
     * An ID that identifies the next `Segment` of a `Linked Segment`.
     *
     * @usage notes
     * If the `Segment` is a part of a `Linked Segment` that uses Hard Linking ((#hard-linking)),
     * then either the `PrevUUID` or the `NextUUID` element is **REQUIRED**. If a `Segment` contains a `NextUUID` but not a `PrevUUID`,
     * then it **MAY** be considered as the first `Segment` of the `Linked Segment`. The `NextUUID` **MUST NOT** be equal to the `SegmentUUID`.
     *
     * @maxOccurs 1
     * @id 0x3EB923
     */
    NextUUID = 0x3eb923,
    /**
     * @interface {@link Elements.NextFilename}
     * @definition
     * A filename corresponding to the file of the next `Linked Segment`.
     *
     * @usage notes
     * Provision of the next filename is for display convenience,
     * but `NextUUID` **SHOULD** be considered authoritative for identifying the Next `Segment`.
     *
     * @maxOccurs 1
     * @id 0x3E83BB
     */
    NextFilename = 0x3e83bb,
    /**
     * @interface {@link Elements.SegmentFamily}
     * @definition
     * A UID that all `Segments` of a `Linked Segment` **MUST** share (128 bits). It is equivalent to a UUID v4 [@!RFC4122] with all bits randomly (or pseudorandomly) chosen. An actual UUID v4 value, where some bits are not random, **MAY** also be used.
     *
     * @usage notes
     * If the `Segment` `Info` contains a `ChapterTranslate` element, this element is **REQUIRED**.
     *
     * @id 0x4444
     */
    SegmentFamily = 0x4444,
    /**
     * @interface {@link Elements.ChapterTranslate}
     * @definition
     * The mapping between this `Segment` and a segment value in the given Chapter Codec.
     *
     * @rationale
     * Chapter Codecs may need to address different segments, but they may not know of the way to identify such segments when stored in Matroska.
     * This element and its child elements add a way to map the internal segments known to the Chapter Codec to the `SegmentUUID`s in Matroska.
     * This allows remuxing a file with Chapter Codec without changing the content of the codec data, just the `Segment` mapping.
     *
     * @id 0x6924
     */
    ChapterTranslate = 0x6924,
    /**
     * @interface {@link Elements.ChapterTranslateID}
     * @definition
     * The binary value used to represent this `Segment` in the chapter codec data.
     * The format depends on the `ChapProcessCodecID` used; see (#chapprocesscodecid-element).
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x69A5
     */
    ChapterTranslateID = 0x69a5,
    /**
     * @interface {@link Elements.ChapterTranslateCodec}
     * @definition
     * Applies to the chapter codec of the given chapter edition(s); see (#chapprocesscodecid-element).
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x69BF
     */
    ChapterTranslateCodec = 0x69bf,
    /**
     * @interface {@link Elements.ChapterTranslateEditionUID}
     * @definition
     * Specifies a chapter edition UID to which this `ChapterTranslate` applies.
     *
     * @usage notes
     * When no `ChapterTranslateEditionUID` is specified in the `ChapterTranslate`, the `ChapterTranslate` applies to all chapter editions found in the `Segment` using the given `ChapterTranslateCodec`.
     *
     * @id 0x69FC
     */
    ChapterTranslateEditionUID = 0x69fc,
    /**
     * @interface {@link Elements.TimestampScale}
     * @definition
     * Base unit for Segment Ticks and Track Ticks, in nanoseconds. A `TimestampScale` value of 1000000 means scaled timestamps in the `Segment` are expressed in milliseconds; see (#timestamps) on how to interpret timestamps.
     *
     * @default 1000000
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x2AD7B1
     */
    TimestampScale = 0x2ad7b1,
    /**
     * @interface {@link Elements.Duration}
     * @definition
     * Duration of the `Segment`, expressed in `Segment` Ticks, which are based on `TimestampScale`; see (#timestamp-ticks).
     *
     * @range > 0x0p+0
     * @maxOccurs 1
     * @id 0x4489
     */
    Duration = 0x4489,
    /**
     * @interface {@link Elements.DateUTC}
     * @definition
     * The date and time that the `Segment` was created by the muxing application or library.
     *
     * @maxOccurs 1
     * @id 0x4461
     */
    DateUTC = 0x4461,
    /**
     * @interface {@link Elements.Title}
     * @definition
     * General name of the `Segment`.
     *
     * @maxOccurs 1
     * @id 0x7BA9
     */
    Title = 0x7ba9,
    /**
     * @interface {@link Elements.MuxingApp}
     * @definition
     * Muxing application or library (example: "libmatroska-0.4.3").
     *
     * @usage notes
     * Include the full name of the application or library followed by the version number.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x4D80
     */
    MuxingApp = 0x4d80,
    /**
     * @interface {@link Elements.WritingApp}
     * @definition
     * Writing application (example: "mkvmerge-0.3.3").
     *
     * @usage notes
     * Include the full name of the application followed by the version number.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x5741
     */
    WritingApp = 0x5741,
    /**
     * @interface {@link Elements.Cluster}
     * @definition
     * The `Top-Level Element` containing the (monolithic) `Block` structure.
     *
     * @id 0x1F43B675
     */
    Cluster = 0x1f43b675,
    /**
     * @interface {@link Elements.Timestamp}
     * @definition
     * Absolute timestamp of the cluster, expressed in Segment Ticks, which are based on `TimestampScale`; see (#timestamp-ticks).
     *
     * @usage notes
     * This element **SHOULD** be the first child element of the `Cluster` it belongs to
     * or the second if that `Cluster` contains a `CRC-32` element ((#crc-32)).
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xE7
     */
    Timestamp = 0xe7,
    /**
     * @interface {@link Elements.SilentTracks}
     * @definition
     * The list of tracks that are not used in that part of the stream.
     * It is useful when using overlay tracks for seeking or deciding what track to use.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x5854
     */
    SilentTracks = 0x5854,
    /**
     * @interface {@link Elements.SilentTrackNumber}
     * @definition
     * One of the track numbers that is not used from now on in the stream.
     * It could change later if not specified as silent in a further `Cluster`.
     *
     * @minver 0
     * @maxver 0
     * @id 0x58D7
     */
    SilentTrackNumber = 0x58d7,
    /**
     * @interface {@link Elements.Position}
     * @definition
     * The `Segment Position` of the `Cluster` in the `Segment` (0 in live streams).
     * It might help to resynchronize the offset on damaged streams.
     *
     * @maxver 4
     * @maxOccurs 1
     * @id 0xA7
     */
    Position = 0xa7,
    /**
     * @interface {@link Elements.PrevSize}
     * @definition
     * Size of the previous `Cluster`, in octets. Can be useful for backward playing.
     *
     * @maxOccurs 1
     * @id 0xAB
     */
    PrevSize = 0xab,
    /**
     * @interface {@link Elements.SimpleBlock}
     * @definition
     * Similar to `Block` (see (#block-structure)) but without all the extra information.
     * Mostly used to reduce overhead when no extra feature is needed; see (#simpleblock-structure) on `SimpleBlock` Structure.
     *
     * @minver 2
     * @id 0xA3
     */
    SimpleBlock = 0xa3,
    /**
     * @interface {@link Elements.BlockGroup}
     * @definition
     * Basic container of information containing a single `Block` and information specific to that `Block`.
     *
     * @id 0xA0
     */
    BlockGroup = 0xa0,
    /**
     * @interface {@link Elements.Block}
     * @definition
     * `Block` containing the actual data to be rendered and a timestamp relative to the `Cluster` Timestamp;
     * see (#block-structure) on `Block` Structure.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xA1
     */
    Block = 0xa1,
    /**
     * @interface {@link Elements.BlockVirtual}
     * @definition
     * A `Block` with no data. It must be stored in the stream at the place the real `Block` would be in display order.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xA2
     */
    BlockVirtual = 0xa2,
    /**
     * @interface {@link Elements.BlockAdditions}
     * @definition
     * Contains additional binary data to complete the `Block` element; see [@?I-D.ietf-cellar-codec, section 4.1.5] for more information.
     * An EBML parser that has no knowledge of the `Block` structure could still see and use/skip these data.
     *
     * @maxOccurs 1
     * @id 0x75A1
     */
    BlockAdditions = 0x75a1,
    /**
     * @interface {@link Elements.BlockMore}
     * @definition
     * Contains the `BlockAdditional` and some parameters.
     *
     * @minOccurs 1
     * @id 0xA6
     */
    BlockMore = 0xa6,
    /**
     * @interface {@link Elements.BlockAdditional}
     * @definition
     * Interpreted by the codec as it wishes (using the `BlockAddID`).
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xA5
     */
    BlockAdditional = 0xa5,
    /**
     * @interface {@link Elements.BlockAddID}
     * @definition
     * An ID that identifies how to interpret the `BlockAdditional` data; see [@?I-D.ietf-cellar-codec, section 4.1.5] for more information.
     * A value of 1 indicates that the `BlockAdditional` data is defined by the codec.
     * Any other value indicates that the `BlockAdditional` data should be handled according to the `BlockAddIDType` that is located in the
     * `TrackEntry`.
     *
     * @usage notes
     * Each `BlockAddID` value **MUST** be unique between all `BlockMore` elements found in a `BlockAdditions` element. To keep `MaxBlockAdditionID` as low as possible, small values **SHOULD** be used.
     *
     * @default 1
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xEE
     */
    BlockAddID = 0xee,
    /**
     * @interface {@link Elements.BlockDuration}
     * @definition
     * The duration of the `Block`, expressed in Track Ticks; see (#timestamp-ticks).
     * The `BlockDuration` element can be useful at the end of a `Track` to define the duration of the last frame (as there is no subsequent `Block` available)
     * or when there is a break in a track like for subtitle tracks.
     *
     * @maxOccurs 1
     * @id 0x9B
     */
    BlockDuration = 0x9b,
    /**
     * @interface {@link Elements.ReferencePriority}
     * @definition
     * This frame is referenced and has the specified cache priority.
     * In the cache, only a frame of the same or higher priority can replace this frame. A value of 0 means the frame is not referenced.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xFA
     */
    ReferencePriority = 0xfa,
    /**
     * @interface {@link Elements.ReferenceBlock}
     * @definition
     * A timestamp value, relative to the timestamp of the `Block` in this `BlockGroup`, expressed in Track Ticks; see (#timestamp-ticks).
     * This is used to reference other frames necessary to decode this frame.
     * The relative value **SHOULD** correspond to a valid `Block` that this `Block` depends on.
     * Historically, `Matroska Writers` didn't write the actual `Block(s)` that this `Block` depends on, but they did write *some* `Block(s)` in the past.
     *
     * The value "0" **MAY** also be used to signify that this `Block` cannot be decoded on its own, but the necessary reference `Block(s)` is unknown. In this case, other `ReferenceBlock` elements **MUST NOT** be found in the same `BlockGroup`.
     *
     * If the `BlockGroup` doesn't have a `ReferenceBlock` element, then the `Block` it contains can be decoded without using any other `Block` data.
     *
     * @id 0xFB
     */
    ReferenceBlock = 0xfb,
    /**
     * @interface {@link Elements.ReferenceVirtual}
     * @definition
     * The `Segment Position` of the data that would otherwise be in position of the virtual block.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xFD
     */
    ReferenceVirtual = 0xfd,
    /**
     * @interface {@link Elements.CodecState}
     * @definition
     * The new codec state to use. Data interpretation is private to the codec.
     * This information **SHOULD** always be referenced by a seek entry.
     *
     * @minver 2
     * @maxOccurs 1
     * @id 0xA4
     */
    CodecState = 0xa4,
    /**
     * @interface {@link Elements.DiscardPadding}
     * @definition
     * Duration of the silent data added to the `Block`, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks)
     * (padding at the end of the `Block` for positive values and at the beginning of the `Block` for negative values).
     * The duration of `DiscardPadding` is not calculated in the duration of the `TrackEntry` and **SHOULD** be discarded during playback.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x75A2
     */
    DiscardPadding = 0x75a2,
    /**
     * @interface {@link Elements.Slices}
     * @definition
     * Contains slices description.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x8E
     */
    Slices = 0x8e,
    /**
     * @interface {@link Elements.TimeSlice}
     * @definition
     * Contains extra time information about the data contained in the `Block`.
     * Being able to interpret this element is not required for playback.
     *
     * @minver 0
     * @maxver 0
     * @id 0xE8
     */
    TimeSlice = 0xe8,
    /**
     * @interface {@link Elements.LaceNumber}
     * @definition
     * The reverse number of the frame in the lace (0 is the last frame, 1 is the next to last, etc.).
     * Being able to interpret this element is not required for playback.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xCC
     */
    LaceNumber = 0xcc,
    /**
     * @interface {@link Elements.FrameNumber}
     * @definition
     * The number of the frame to generate from this lace with this delay
     * (allows for the generation of many frames from the same Block/Frame).
     *
     * @default 0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xCD
     */
    FrameNumber = 0xcd,
    /**
     * @interface {@link Elements.BlockAdditionID}
     * @definition
     * The ID of the `BlockAdditional` element (0 is the main `Block`).
     *
     * @default 0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xCB
     */
    BlockAdditionID = 0xcb,
    /**
     * @interface {@link Elements.Delay}
     * @definition
     * The delay to apply to the element, expressed in Track Ticks; see (#timestamp-ticks).
     *
     * @default 0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xCE
     */
    Delay = 0xce,
    /**
     * @interface {@link Elements.SliceDuration}
     * @definition
     * The duration to apply to the element, expressed in Track Ticks; see (#timestamp-ticks).
     *
     * @default 0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xCF
     */
    SliceDuration = 0xcf,
    /**
     * @interface {@link Elements.ReferenceFrame}
     * @definition
     * Contains information about the last reference frame. See [@?DivXTrickTrack].
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xC8
     */
    ReferenceFrame = 0xc8,
    /**
     * @interface {@link Elements.ReferenceOffset}
     * @definition
     * The relative offset, in bytes, from the previous `BlockGroup` element for this Smooth FF/RW video track to the containing `BlockGroup`
     * element. See [@?DivXTrickTrack].
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xC9
     */
    ReferenceOffset = 0xc9,
    /**
     * @interface {@link Elements.ReferenceTimestamp}
     * @definition
     * The timestamp of the `BlockGroup` pointed to by ReferenceOffset, expressed in Track Ticks; see (#timestamp-ticks). See [@?DivXTrickTrack].
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xCA
     */
    ReferenceTimestamp = 0xca,
    /**
     * @interface {@link Elements.EncryptedBlock}
     * @definition
     * Similar to `SimpleBlock` (see (#simpleblock-structure)),
     * but the data inside the `Block` are Transformed (encrypted and/or signed).
     *
     * @minver 0
     * @maxver 0
     * @id 0xAF
     */
    EncryptedBlock = 0xaf,
    /**
     * @interface {@link Elements.Tracks}
     * @definition
     * A `Top-Level Element` of information with many tracks described.
     *
     * @maxOccurs 1
     * @id 0x1654AE6B
     */
    Tracks = 0x1654ae6b,
    /**
     * @interface {@link Elements.TrackEntry}
     * @definition
     * Describes a track with all elements.
     *
     * @minOccurs 1
     * @id 0xAE
     */
    TrackEntry = 0xae,
    /**
     * @interface {@link Elements.TrackNumber}
     * @definition
     * The track number as used in the `Block` Header.
     *
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xD7
     */
    TrackNumber = 0xd7,
    /**
     * @interface {@link Elements.TrackUID}
     * @definition
     * A UID that identifies the `Track`.
     *
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x73C5
     */
    TrackUID = 0x73c5,
    /**
     * @interface {@link Elements.TrackType}
     * @definition
     * The `TrackType` defines the type of each frame found in the `Track`.
     * The value **SHOULD** be stored on 1 octet.
     *
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x83
     */
    TrackType = 0x83,
    /**
     * @interface {@link Elements.FlagEnabled}
     * @definition
     * Set to 1 if the track is usable. It is possible to turn a track that is not usable into a usable track using chapter codecs or control tracks.
     *
     * @default 1
     * @range 0-1
     * @minver 2
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xB9
     */
    FlagEnabled = 0xb9,
    /**
     * @interface {@link Elements.FlagDefault}
     * @definition
     * Set to 1 if the track (audio, video, or subtitles) is eligible for automatic selection by the player; see (#default-track-selection) for more details.
     *
     * @default 1
     * @range 0-1
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x88
     */
    FlagDefault = 0x88,
    /**
     * @interface {@link Elements.FlagForced}
     * @definition
     * Applies only to subtitles. Set to 1 if the track is eligible for automatic selection by the player if it matches the user's language preference,
     * even if the user's preferences would not normally enable subtitles with the selected audio track;
     * this can be used for tracks containing only translations of audio in foreign languages or on-screen text.
     * See (#default-track-selection) for more details.
     *
     * @default 0
     * @range 0-1
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x55AA
     */
    FlagForced = 0x55aa,
    /**
     * @interface {@link Elements.FlagHearingImpaired}
     * @definition
     * Set to 1 if and only if the track is suitable for users with hearing impairments.
     *
     * @range 0-1
     * @minver 4
     * @maxOccurs 1
     * @id 0x55AB
     */
    FlagHearingImpaired = 0x55ab,
    /**
     * @interface {@link Elements.FlagVisualImpaired}
     * @definition
     * Set to 1 if and only if the track is suitable for users with visual impairments.
     *
     * @range 0-1
     * @minver 4
     * @maxOccurs 1
     * @id 0x55AC
     */
    FlagVisualImpaired = 0x55ac,
    /**
     * @interface {@link Elements.FlagTextDescriptions}
     * @definition
     * Set to 1 if and only if the track contains textual descriptions of video content.
     *
     * @range 0-1
     * @minver 4
     * @maxOccurs 1
     * @id 0x55AD
     */
    FlagTextDescriptions = 0x55ad,
    /**
     * @interface {@link Elements.FlagOriginal}
     * @definition
     * Set to 1 if and only if the track is in the content's original language.
     *
     * @range 0-1
     * @minver 4
     * @maxOccurs 1
     * @id 0x55AE
     */
    FlagOriginal = 0x55ae,
    /**
     * @interface {@link Elements.FlagCommentary}
     * @definition
     * Set to 1 if and only if the track contains commentary.
     *
     * @range 0-1
     * @minver 4
     * @maxOccurs 1
     * @id 0x55AF
     */
    FlagCommentary = 0x55af,
    /**
     * @interface {@link Elements.FlagLacing}
     * @definition
     * Set to 1 if the track **MAY** contain blocks that use lacing. When set to 0, all blocks **MUST** have their lacing flags set to "no lacing"; see (#block-lacing) on 'Block' Lacing.
     *
     * @default 1
     * @range 0-1
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x9C
     */
    FlagLacing = 0x9c,
    /**
     * @interface {@link Elements.MinCache}
     * @definition
     * The minimum number of frames a player should be able to cache during playback.
     * If set to 0, the reference pseudo-cache system is not used.
     *
     * @default 0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x6DE7
     */
    MinCache = 0x6de7,
    /**
     * @interface {@link Elements.MaxCache}
     * @definition
     * The maximum cache size necessary to store referenced frames in and the current frame.
     * 0 means no cache is needed.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x6DF8
     */
    MaxCache = 0x6df8,
    /**
     * @interface {@link Elements.DefaultDuration}
     * @definition
     * Number of nanoseconds per frame, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks)
     * ("frame" in the Matroska sense -- one element put into a (Simple)Block).
     *
     * @range not 0
     * @maxOccurs 1
     * @id 0x23E383
     */
    DefaultDuration = 0x23e383,
    /**
     * @interface {@link Elements.DefaultDecodedFieldDuration}
     * @definition
     * The period between two successive fields at the output of the decoding process, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks).
     * See (#defaultdecodedfieldduration) for more information.
     *
     * @range not 0
     * @minver 4
     * @maxOccurs 1
     * @id 0x234E7A
     */
    DefaultDecodedFieldDuration = 0x234e7a,
    /**
     * @interface {@link Elements.TrackTimestampScale}
     * @definition
     * The scale to apply on this track to work at normal speed in relation with other tracks
     * (mostly used to adjust video speed when the audio length differs).
     *
     * @default 0x1p+0
     * @range > 0x0p+0
     * @maxver 3
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x23314F
     */
    TrackTimestampScale = 0x23314f,
    /**
     * @interface {@link Elements.TrackOffset}
     * @definition
     * A value to add to the `Block`'s Timestamp, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks).
     * This can be used to adjust the playback offset of a track.
     *
     * @default 0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x537F
     */
    TrackOffset = 0x537f,
    /**
     * @interface {@link Elements.MaxBlockAdditionID}
     * @definition
     * The maximum value of `BlockAddID` ((#blockaddid-element)).
     * A value of 0 means there is no `BlockAdditions` ((#blockadditions-element)) for this track.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x55EE
     */
    MaxBlockAdditionID = 0x55ee,
    /**
     * @interface {@link Elements.BlockAdditionMapping}
     * @definition
     * Contains elements that extend the track format by adding content either to each frame,
     * with `BlockAddID` ((#blockaddid-element)), or to the track as a whole
     * with `BlockAddIDExtraData`.
     *
     * @minver 4
     * @id 0x41E4
     */
    BlockAdditionMapping = 0x41e4,
    /**
     * @interface {@link Elements.BlockAddIDValue}
     * @definition
     * If the track format extension needs content beside frames,
     * the value refers to the `BlockAddID` ((#blockaddid-element)) value being described.
     *
     * @usage notes
     * To keep `MaxBlockAdditionID` as low as possible, small values **SHOULD** be used.
     *
     * @range >=2
     * @minver 4
     * @maxOccurs 1
     * @id 0x41F0
     */
    BlockAddIDValue = 0x41f0,
    /**
     * @interface {@link Elements.BlockAddIDName}
     * @definition
     * A human-friendly name describing the type of `BlockAdditional` data,
     * as defined by the associated `Block Additional Mapping`.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x41A4
     */
    BlockAddIDName = 0x41a4,
    /**
     * @interface {@link Elements.BlockAddIDType}
     * @definition
     * Stores the registered identifier of the `Block Additional Mapping`
     * to define how the `BlockAdditional` data should be handled.
     *
     * @usage notes
     * If `BlockAddIDType` is 0, the `BlockAddIDValue` and corresponding `BlockAddID` values **MUST** be 1.
     *
     * @default 0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x41E7
     */
    BlockAddIDType = 0x41e7,
    /**
     * @interface {@link Elements.BlockAddIDExtraData}
     * @definition
     * Extra binary data that the `BlockAddIDType` can use to interpret the `BlockAdditional` data.
     * The interpretation of the binary data depends on the `BlockAddIDType` value and the corresponding `Block Additional Mapping`.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x41ED
     */
    BlockAddIDExtraData = 0x41ed,
    /**
     * @interface {@link Elements.Name}
     * @definition
     * A human-readable track name.
     *
     * @maxOccurs 1
     * @id 0x536E
     */
    Name = 0x536e,
    /**
     * @interface {@link Elements.Language}
     * @definition
     * The language of the track,
     * in the Matroska languages form; see (#language-codes) on language codes.
     * This element **MUST** be ignored if the `LanguageBCP47` element is used in the same `TrackEntry`.
     *
     * @default eng
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x22B59C
     */
    Language = 0x22b59c,
    /**
     * @interface {@link Elements.LanguageBCP47}
     * @definition
     * The language of the track,
     * in the form defined in [@!RFC5646]; see (#language-codes) on language codes.
     * If this element is used, then any `Language` elements used in the same `TrackEntry` **MUST** be ignored.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x22B59D
     */
    LanguageBCP47 = 0x22b59d,
    /**
     * @interface {@link Elements.CodecID}
     * @definition
     * An ID corresponding to the codec;
     * see [@?I-D.ietf-cellar-codec] for more info.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x86
     */
    CodecID = 0x86,
    /**
     * @interface {@link Elements.CodecPrivate}
     * @definition
     * Private data only known to the codec.
     *
     * @maxOccurs 1
     * @id 0x63A2
     */
    CodecPrivate = 0x63a2,
    /**
     * @interface {@link Elements.CodecName}
     * @definition
     * A human-readable string specifying the codec.
     *
     * @maxOccurs 1
     * @id 0x258688
     */
    CodecName = 0x258688,
    /**
     * @interface {@link Elements.AttachmentLink}
     * @definition
     * The UID of an attachment that is used by this codec.
     *
     * @usage notes
     * The value **MUST** match the `FileUID` value of an attachment found in this `Segment`.
     *
     * @range not 0
     * @maxver 3
     * @maxOccurs 1
     * @id 0x7446
     */
    AttachmentLink = 0x7446,
    /**
     * @interface {@link Elements.CodecSettings}
     * @definition
     * A string describing the encoding setting used.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x3A9697
     */
    CodecSettings = 0x3a9697,
    /**
     * @interface {@link Elements.CodecInfoURL}
     * @definition
     * A URL to find information about the codec used.
     *
     * @minver 0
     * @maxver 0
     * @id 0x3B4040
     */
    CodecInfoURL = 0x3b4040,
    /**
     * @interface {@link Elements.CodecDownloadURL}
     * @definition
     * A URL to download information about the codec used.
     *
     * @minver 0
     * @maxver 0
     * @id 0x26B240
     */
    CodecDownloadURL = 0x26b240,
    /**
     * @interface {@link Elements.CodecDecodeAll}
     * @definition
     * Set to 1 if the codec can decode potentially damaged data.
     *
     * @default 1
     * @range 0-1
     * @maxver 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xAA
     */
    CodecDecodeAll = 0xaa,
    /**
     * @interface {@link Elements.TrackOverlay}
     * @definition
     * Specify that this track is an overlay track for the `Track` specified (in the u-integer).
     * This means that when this track has a gap on `SilentTracks`,
     * the overlay track should be used instead. The order of multiple `TrackOverlay` matters; the first one is the one that should be used.
     * If the first one is not found, it should be the second, etc.
     *
     * @maxver 0
     * @id 0x6FAB
     */
    TrackOverlay = 0x6fab,
    /**
     * @interface {@link Elements.CodecDelay}
     * @definition
     * The built-in delay for the codec, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks).
     * It represents the number of codec samples that will be discarded by the decoder during playback.
     * This timestamp value **MUST** be subtracted from each frame timestamp in order to get the timestamp that will be actually played.
     * The value **SHOULD** be small so the muxing of tracks with the same actual timestamp are in the same `Cluster`.
     *
     * @default 0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x56AA
     */
    CodecDelay = 0x56aa,
    /**
     * @interface {@link Elements.SeekPreRoll}
     * @definition
     * After a discontinuity, the duration of the data
     * that the decoder **MUST** decode before the decoded data is valid, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks).
     *
     * @default 0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x56BB
     */
    SeekPreRoll = 0x56bb,
    /**
     * @interface {@link Elements.TrackTranslate}
     * @definition
     * The mapping between this `TrackEntry` and a track value in the given Chapter Codec.
     *
     * @rationale
     * Chapter Codecs may need to address content in a specific track, but they may not know of the way to identify tracks in Matroska.
     * This element and its child elements add a way to map the internal tracks known to the Chapter Codec to the track IDs in Matroska.
     * This allows remuxing a file with Chapter Codec without changing the content of the codec data, just the track mapping.
     *
     * @id 0x6624
     */
    TrackTranslate = 0x6624,
    /**
     * @interface {@link Elements.TrackTranslateTrackID}
     * @definition
     * The binary value used to represent this `TrackEntry` in the chapter codec data.
     * The format depends on the `ChapProcessCodecID` used; see (#chapprocesscodecid-element).
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x66A5
     */
    TrackTranslateTrackID = 0x66a5,
    /**
     * @interface {@link Elements.TrackTranslateCodec}
     * @definition
     * Applies to the chapter codec of the given chapter edition(s); see (#chapprocesscodecid-element).
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x66BF
     */
    TrackTranslateCodec = 0x66bf,
    /**
     * @interface {@link Elements.TrackTranslateEditionUID}
     * @definition
     * Specifies a chapter edition UID to which this `TrackTranslate` applies.
     *
     * @usage notes
     * When no `TrackTranslateEditionUID` is specified in the `TrackTranslate`, the `TrackTranslate` applies to all chapter editions found in the `Segment` using the given `TrackTranslateCodec`.
     *
     * @id 0x66FC
     */
    TrackTranslateEditionUID = 0x66fc,
    /**
     * @interface {@link Elements.Video}
     * @definition
     * Video settings.
     *
     * @maxOccurs 1
     * @id 0xE0
     */
    Video = 0xe0,
    /**
     * @interface {@link Elements.FlagInterlaced}
     * @definition
     * Specifies whether the video frames in this track are interlaced.
     *
     * @default 0
     * @minver 2
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x9A
     */
    FlagInterlaced = 0x9a,
    /**
     * @interface {@link Elements.FieldOrder}
     * @definition
     * Specifies the field ordering of video frames in this track.
     *
     * @usage notes
     * If `FlagInterlaced` is not set to 1, this element **MUST** be ignored.
     *
     * @default 2
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x9D
     */
    FieldOrder = 0x9d,
    /**
     * @interface {@link Elements.StereoMode}
     * @definition
     * Stereo-3D video mode. See (#multi-planar-and-3d-videos) for more details.
     *
     * @default 0
     * @minver 3
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x53B8
     */
    StereoMode = 0x53b8,
    /**
     * @interface {@link Elements.AlphaMode}
     * @definition
     * Indicates whether the `BlockAdditional` element with `BlockAddID` of "1" contains Alpha data as defined by the Codec Mapping for the `CodecID`.
     *  Undefined values (i.e., values other than 0 or 1) **SHOULD NOT** be used, as the behavior of known implementations is different.
     *
     * @default 0
     * @minver 3
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x53C0
     */
    AlphaMode = 0x53c0,
    /**
     * @interface {@link Elements.OldStereoMode}
     * @definition
     * Bogus `StereoMode` value used in old versions of [@?libmatroska].
     *
     * @usage notes
     * This element **MUST NOT** be used. It was an incorrect value used in libmatroska up to 0.9.0.
     *
     * @maxver 2
     * @maxOccurs 1
     * @id 0x53B9
     */
    OldStereoMode = 0x53b9,
    /**
     * @interface {@link Elements.PixelWidth}
     * @definition
     * Width of the encoded video frames in pixels.
     *
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xB0
     */
    PixelWidth = 0xb0,
    /**
     * @interface {@link Elements.PixelHeight}
     * @definition
     * Height of the encoded video frames in pixels.
     *
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xBA
     */
    PixelHeight = 0xba,
    /**
     * @interface {@link Elements.PixelCropBottom}
     * @definition
     * The number of video pixels to remove at the bottom of the image.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x54AA
     */
    PixelCropBottom = 0x54aa,
    /**
     * @interface {@link Elements.PixelCropTop}
     * @definition
     * The number of video pixels to remove at the top of the image.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x54BB
     */
    PixelCropTop = 0x54bb,
    /**
     * @interface {@link Elements.PixelCropLeft}
     * @definition
     * The number of video pixels to remove on the left of the image.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x54CC
     */
    PixelCropLeft = 0x54cc,
    /**
     * @interface {@link Elements.PixelCropRight}
     * @definition
     * The number of video pixels to remove on the right of the image.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x54DD
     */
    PixelCropRight = 0x54dd,
    /**
     * @interface {@link Elements.DisplayWidth}
     * @definition
     * Width of the video frames to display. Applies to the video frame after cropping (PixelCrop* Elements).
     *
     * @range not 0
     * @maxOccurs 1
     * @id 0x54B0
     */
    DisplayWidth = 0x54b0,
    /**
     * @interface {@link Elements.DisplayHeight}
     * @definition
     * Height of the video frames to display. Applies to the video frame after cropping (PixelCrop* Elements).
     *
     * @range not 0
     * @maxOccurs 1
     * @id 0x54BA
     */
    DisplayHeight = 0x54ba,
    /**
     * @interface {@link Elements.DisplayUnit}
     * @definition
     * How `DisplayWidth` and `DisplayHeight` are interpreted.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x54B2
     */
    DisplayUnit = 0x54b2,
    /**
     * @interface {@link Elements.AspectRatioType}
     * @definition
     * Specifies the possible modifications to the aspect ratio.
     *
     * @default 0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x54B3
     */
    AspectRatioType = 0x54b3,
    /**
     * @interface {@link Elements.UncompressedFourCC}
     * @definition
     * Specifies the uncompressed pixel format used for the `Track`'s data as a FourCC.
     * This value is similar in scope to the biCompression value of AVI's `BITMAPINFO` [@?AVIFormat]. There is neither a definitive list of FourCC values nor an official registry. Some common values for YUV pixel formats can be found at [@?MSYUV8], [@?MSYUV16], and [@?FourCC-YUV]. Some common values for uncompressed RGB pixel formats can be found at [@?MSRGB] and [@?FourCC-RGB].
     *
     * @maxOccurs 1
     * @id 0x2EB524
     */
    UncompressedFourCC = 0x2eb524,
    /**
     * @interface {@link Elements.GammaValue}
     * @definition
     * Gamma value.
     *
     * @range > 0x0p+0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x2FB523
     */
    GammaValue = 0x2fb523,
    /**
     * @interface {@link Elements.FrameRate}
     * @definition
     * Number of frames per second. This value is informational only. It is intended for constant frame rate streams and should not be used for a variable frame rate `TrackEntry`.
     *
     * @range > 0x0p+0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x2383E3
     */
    FrameRate = 0x2383e3,
    /**
     * @interface {@link Elements.Colour}
     * @definition
     * Settings describing the color format.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x55B0
     */
    Colour = 0x55b0,
    /**
     * @interface {@link Elements.MatrixCoefficients}
     * @definition
     * The Matrix Coefficients of the video used to derive luma and chroma values from red, green, and blue color primaries.
     * For clarity, the value and meanings for `MatrixCoefficients` are adopted from Table 4 of [@!ITU-H.273].
     *
     * @default 2
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x55B1
     */
    MatrixCoefficients = 0x55b1,
    /**
     * @interface {@link Elements.BitsPerChannel}
     * @definition
     * Number of decoded bits per channel. A value of 0 indicates that the `BitsPerChannel` is unspecified.
     *
     * @default 0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x55B2
     */
    BitsPerChannel = 0x55b2,
    /**
     * @interface {@link Elements.ChromaSubsamplingHorz}
     * @definition
     * The number of pixels to remove in the Cr and Cb channels for every pixel not removed horizontally.
     * Example: For video with 4:2:0 chroma subsampling, the `ChromaSubsamplingHorz` **SHOULD** be set to 1.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x55B3
     */
    ChromaSubsamplingHorz = 0x55b3,
    /**
     * @interface {@link Elements.ChromaSubsamplingVert}
     * @definition
     * The number of pixels to remove in the Cr and Cb channels for every pixel not removed vertically.
     * Example: For video with 4:2:0 chroma subsampling, the `ChromaSubsamplingVert` **SHOULD** be set to 1.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x55B4
     */
    ChromaSubsamplingVert = 0x55b4,
    /**
     * @interface {@link Elements.CbSubsamplingHorz}
     * @definition
     * The number of pixels to remove in the Cb channel for every pixel not removed horizontally.
     * This is additive with `ChromaSubsamplingHorz`. Example: For video with 4:2:1 chroma subsampling,
     * the `ChromaSubsamplingHorz` **SHOULD** be set to 1, and `CbSubsamplingHorz` **SHOULD** be set to 1.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x55B5
     */
    CbSubsamplingHorz = 0x55b5,
    /**
     * @interface {@link Elements.CbSubsamplingVert}
     * @definition
     * The number of pixels to remove in the Cb channel for every pixel not removed vertically.
     * This is additive with `ChromaSubsamplingVert`.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x55B6
     */
    CbSubsamplingVert = 0x55b6,
    /**
     * @interface {@link Elements.ChromaSitingHorz}
     * @definition
     * How chroma is subsampled horizontally.
     *
     * @default 0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x55B7
     */
    ChromaSitingHorz = 0x55b7,
    /**
     * @interface {@link Elements.ChromaSitingVert}
     * @definition
     * How chroma is subsampled vertically.
     *
     * @default 0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x55B8
     */
    ChromaSitingVert = 0x55b8,
    /**
     * @interface {@link Elements.Range}
     * @definition
     * Clipping of the color ranges.
     *
     * @default 0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x55B9
     */
    Range = 0x55b9,
    /**
     * @interface {@link Elements.TransferCharacteristics}
     * @definition
     * The transfer characteristics of the video. For clarity,
     * the value and meanings for `TransferCharacteristics` are adopted from Table 3 of [@!ITU-H.273].
     *
     * @default 2
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x55BA
     */
    TransferCharacteristics = 0x55ba,
    /**
     * @interface {@link Elements.Primaries}
     * @definition
     * The color primaries of the video. For clarity,
     * the value and meanings for `Primaries` are adopted from Table 2 of [@!ITU-H.273].
     *
     * @default 2
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x55BB
     */
    Primaries = 0x55bb,
    /**
     * @interface {@link Elements.MaxCLL}
     * @definition
     * Maximum brightness of a single pixel (Maximum Content Light Level)
     * in candelas per square meter (cd/m^2^).
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x55BC
     */
    MaxCLL = 0x55bc,
    /**
     * @interface {@link Elements.MaxFALL}
     * @definition
     * Maximum brightness of a single full frame (Maximum Frame-Average Light Level)
     * in candelas per square meter (cd/m^2^).
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x55BD
     */
    MaxFALL = 0x55bd,
    /**
     * @interface {@link Elements.MasteringMetadata}
     * @definition
     * SMPTE 2086 mastering data.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x55D0
     */
    MasteringMetadata = 0x55d0,
    /**
     * @interface {@link Elements.PrimaryRChromaticityX}
     * @definition
     * Red X chromaticity coordinate, as defined by [@!CIE-1931].
     *
     * @range 0x0p+0-0x1p+0
     * @minver 4
     * @maxOccurs 1
     * @id 0x55D1
     */
    PrimaryRChromaticityX = 0x55d1,
    /**
     * @interface {@link Elements.PrimaryRChromaticityY}
     * @definition
     * Red Y chromaticity coordinate, as defined by [@!CIE-1931].
     *
     * @range 0x0p+0-0x1p+0
     * @minver 4
     * @maxOccurs 1
     * @id 0x55D2
     */
    PrimaryRChromaticityY = 0x55d2,
    /**
     * @interface {@link Elements.PrimaryGChromaticityX}
     * @definition
     * Green X chromaticity coordinate, as defined by [@!CIE-1931].
     *
     * @range 0x0p+0-0x1p+0
     * @minver 4
     * @maxOccurs 1
     * @id 0x55D3
     */
    PrimaryGChromaticityX = 0x55d3,
    /**
     * @interface {@link Elements.PrimaryGChromaticityY}
     * @definition
     * Green Y chromaticity coordinate, as defined by [@!CIE-1931].
     *
     * @range 0x0p+0-0x1p+0
     * @minver 4
     * @maxOccurs 1
     * @id 0x55D4
     */
    PrimaryGChromaticityY = 0x55d4,
    /**
     * @interface {@link Elements.PrimaryBChromaticityX}
     * @definition
     * Blue X chromaticity coordinate, as defined by [@!CIE-1931].
     *
     * @range 0x0p+0-0x1p+0
     * @minver 4
     * @maxOccurs 1
     * @id 0x55D5
     */
    PrimaryBChromaticityX = 0x55d5,
    /**
     * @interface {@link Elements.PrimaryBChromaticityY}
     * @definition
     * Blue Y chromaticity coordinate, as defined by [@!CIE-1931].
     *
     * @range 0x0p+0-0x1p+0
     * @minver 4
     * @maxOccurs 1
     * @id 0x55D6
     */
    PrimaryBChromaticityY = 0x55d6,
    /**
     * @interface {@link Elements.WhitePointChromaticityX}
     * @definition
     * White X chromaticity coordinate, as defined by [@!CIE-1931].
     *
     * @range 0x0p+0-0x1p+0
     * @minver 4
     * @maxOccurs 1
     * @id 0x55D7
     */
    WhitePointChromaticityX = 0x55d7,
    /**
     * @interface {@link Elements.WhitePointChromaticityY}
     * @definition
     * White Y chromaticity coordinate, as defined by [@!CIE-1931].
     *
     * @range 0x0p+0-0x1p+0
     * @minver 4
     * @maxOccurs 1
     * @id 0x55D8
     */
    WhitePointChromaticityY = 0x55d8,
    /**
     * @interface {@link Elements.LuminanceMax}
     * @definition
     * Maximum luminance. Represented in candelas per square meter (cd/m^2^).
     *
     * @range >= 0x0p+0
     * @minver 4
     * @maxOccurs 1
     * @id 0x55D9
     */
    LuminanceMax = 0x55d9,
    /**
     * @interface {@link Elements.LuminanceMin}
     * @definition
     * Minimum luminance. Represented in candelas per square meter (cd/m^2^).
     *
     * @range >= 0x0p+0
     * @minver 4
     * @maxOccurs 1
     * @id 0x55DA
     */
    LuminanceMin = 0x55da,
    /**
     * @interface {@link Elements.Projection}
     * @definition
     * Describes the video projection details. Used to render spherical or VR videos or to flip videos horizontally or vertically.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x7670
     */
    Projection = 0x7670,
    /**
     * @interface {@link Elements.ProjectionType}
     * @definition
     * Describes the projection used for this video track.
     *
     * @default 0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x7671
     */
    ProjectionType = 0x7671,
    /**
     * @interface {@link Elements.ProjectionPrivate}
     * @definition
     * Private data that only applies to a specific projection.
     * *  If `ProjectionType` equals 0 (rectangular),
     *      then this element **MUST NOT** be present.
     * *  If `ProjectionType` equals 1 (equirectangular), then this element **MUST** be present and contain the same binary data that would be stored inside
     *       an ISOBMFF Equirectangular Projection Box ("equi").
     * *  If `ProjectionType` equals 2 (cubemap), then this element **MUST** be present and contain the same binary data that would be stored
     *       inside an ISOBMFF Cubemap Projection Box ("cbmp").
     * *  If `ProjectionType` equals 3 (mesh), then this element **MUST** be present and contain the same binary data that would be stored inside
     *        an ISOBMFF Mesh Projection Box ("mshp").
     *
     * @usage notes
     * ISOBMFF box size and FourCC fields are not included in the binary data,
     * but the FullBox version and flag fields are. This is to avoid
     * redundant framing information while preserving versioning and semantics between the two container formats.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x7672
     */
    ProjectionPrivate = 0x7672,
    /**
     * @interface {@link Elements.ProjectionPoseYaw}
     * @definition
     * Specifies a yaw rotation to the projection.
     *
     * Value represents a clockwise rotation, in degrees, around the up vector. This rotation must be applied
     * before any `ProjectionPosePitch` or `ProjectionPoseRoll` rotations.
     * The value of this element **MUST** be in the -180 to 180 degree range, both inclusive.
     *
     * Setting `ProjectionPoseYaw` to 180 or -180 degrees with `ProjectionPoseRoll` and `ProjectionPosePitch` set to 0 degrees flips the image horizontally.
     *
     * @default 0x0p+0
     * @range >= -0xB4p+0, <= 0xB4p+0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x7673
     */
    ProjectionPoseYaw = 0x7673,
    /**
     * @interface {@link Elements.ProjectionPosePitch}
     * @definition
     * Specifies a pitch rotation to the projection.
     *
     * Value represents a counter-clockwise rotation, in degrees, around the right vector. This rotation must be applied
     * after the `ProjectionPoseYaw` rotation and before the `ProjectionPoseRoll` rotation.
     * The value of this element **MUST** be in the -90 to 90 degree range, both inclusive.
     *
     * @default 0x0p+0
     * @range >= -0x5Ap+0, <= 0x5Ap+0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x7674
     */
    ProjectionPosePitch = 0x7674,
    /**
     * @interface {@link Elements.ProjectionPoseRoll}
     * @definition
     * Specifies a roll rotation to the projection.
     *
     * Value represents a counter-clockwise rotation, in degrees, around the forward vector. This rotation must be applied
     * after the `ProjectionPoseYaw` and `ProjectionPosePitch` rotations.
     * The value of this element **MUST** be in the -180 to 180 degree range, both inclusive.
     *
     * Setting `ProjectionPoseRoll` to 180 or -180 degrees and `ProjectionPoseYaw` to 180 or -180 degrees with `ProjectionPosePitch` set to 0 degrees flips the image vertically.
     *
     * Setting `ProjectionPoseRoll` to 180 or -180 degrees with `ProjectionPoseYaw` and `ProjectionPosePitch` set to 0 degrees flips the image horizontally and vertically.
     *
     * @default 0x0p+0
     * @range >= -0xB4p+0, <= 0xB4p+0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x7675
     */
    ProjectionPoseRoll = 0x7675,
    /**
     * @interface {@link Elements.Audio}
     * @definition
     * Audio settings.
     *
     * @maxOccurs 1
     * @id 0xE1
     */
    Audio = 0xe1,
    /**
     * @interface {@link Elements.SamplingFrequency}
     * @definition
     * Sampling frequency in Hz.
     *
     * @default 0x1.f4p+12
     * @range > 0x0p+0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xB5
     */
    SamplingFrequency = 0xb5,
    /**
     * @interface {@link Elements.OutputSamplingFrequency}
     * @definition
     * Real output sampling frequency in Hz that is used for Spectral Band Replication (SBR) techniques.
     *
     * @range > 0x0p+0
     * @maxOccurs 1
     * @id 0x78B5
     */
    OutputSamplingFrequency = 0x78b5,
    /**
     * @interface {@link Elements.Channels}
     * @definition
     * Numbers of channels in the track.
     *
     * @default 1
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x9F
     */
    Channels = 0x9f,
    /**
     * @interface {@link Elements.ChannelPositions}
     * @definition
     * Table of horizontal angles for each successive channel.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x7D7B
     */
    ChannelPositions = 0x7d7b,
    /**
     * @interface {@link Elements.BitDepth}
     * @definition
     * Bits per sample, mostly used for PCM.
     *
     * @range not 0
     * @maxOccurs 1
     * @id 0x6264
     */
    BitDepth = 0x6264,
    /**
     * @interface {@link Elements.Emphasis}
     * @definition
     * Audio emphasis applied on audio samples. The player **MUST** apply the inverse emphasis to get the proper audio samples.
     *
     * @default 0
     * @minver 5
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x52F1
     */
    Emphasis = 0x52f1,
    /**
     * @interface {@link Elements.TrackOperation}
     * @definition
     * Operation that needs to be applied on tracks to create this virtual track.
     * For more details, see (#track-operation).
     *
     * @minver 3
     * @maxOccurs 1
     * @id 0xE2
     */
    TrackOperation = 0xe2,
    /**
     * @interface {@link Elements.TrackCombinePlanes}
     * @definition
     * Contains the list of all video plane tracks that need to be combined to create this 3D track.
     *
     * @minver 3
     * @maxOccurs 1
     * @id 0xE3
     */
    TrackCombinePlanes = 0xe3,
    /**
     * @interface {@link Elements.TrackPlane}
     * @definition
     * Contains a video plane track that needs to be combined to create this 3D track.
     *
     * @minver 3
     * @minOccurs 1
     * @id 0xE4
     */
    TrackPlane = 0xe4,
    /**
     * @interface {@link Elements.TrackPlaneUID}
     * @definition
     * The `TrackUID` number of the track representing the plane.
     *
     * @range not 0
     * @minver 3
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xE5
     */
    TrackPlaneUID = 0xe5,
    /**
     * @interface {@link Elements.TrackPlaneType}
     * @definition
     * The kind of plane this track corresponds to.
     *
     * @minver 3
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xE6
     */
    TrackPlaneType = 0xe6,
    /**
     * @interface {@link Elements.TrackJoinBlocks}
     * @definition
     * Contains the list of all tracks whose `Blocks` need to be combined to create this virtual track.
     *
     * @minver 3
     * @maxOccurs 1
     * @id 0xE9
     */
    TrackJoinBlocks = 0xe9,
    /**
     * @interface {@link Elements.TrackJoinUID}
     * @definition
     * The `TrackUID` number of a track whose blocks are used to create this virtual track.
     *
     * @range not 0
     * @minver 3
     * @minOccurs 1
     * @id 0xED
     */
    TrackJoinUID = 0xed,
    /**
     * @interface {@link Elements.TrickTrackUID}
     * @definition
     * The `TrackUID` of the Smooth FF/RW video in the paired EBML structure corresponding to this video track. See [@?DivXTrickTrack].
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xC0
     */
    TrickTrackUID = 0xc0,
    /**
     * @interface {@link Elements.TrickTrackSegmentUID}
     * @definition
     * The `SegmentUUID` of the `Segment` containing the track identified by TrickTrackUID. See [@?DivXTrickTrack].
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xC1
     */
    TrickTrackSegmentUID = 0xc1,
    /**
     * @interface {@link Elements.TrickTrackFlag}
     * @definition
     * Set to 1 if this video track is a Smooth FF/RW track. If set to 1, `MasterTrackUID` and `MasterTrackSegUID` should be present, and `BlockGroups` for this track must contain ReferenceFrame structures.
     * Otherwise, TrickTrackUID and TrickTrackSegUID must be present if this track has a corresponding Smooth FF/RW track. See [@?DivXTrickTrack].
     *
     * @default 0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xC6
     */
    TrickTrackFlag = 0xc6,
    /**
     * @interface {@link Elements.TrickMasterTrackUID}
     * @definition
     * The `TrackUID` of the video track in the paired EBML structure that corresponds to this Smooth FF/RW track. See [@?DivXTrickTrack].
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xC7
     */
    TrickMasterTrackUID = 0xc7,
    /**
     * @interface {@link Elements.TrickMasterTrackSegmentUID}
     * @definition
     * The `SegmentUUID` of the `Segment` containing the track identified by MasterTrackUID. See [@?DivXTrickTrack].
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xC4
     */
    TrickMasterTrackSegmentUID = 0xc4,
    /**
     * @interface {@link Elements.ContentEncodings}
     * @definition
     * Settings for several content encoding mechanisms like compression or encryption.
     *
     * @maxOccurs 1
     * @id 0x6D80
     */
    ContentEncodings = 0x6d80,
    /**
     * @interface {@link Elements.ContentEncoding}
     * @definition
     * Settings for one content encoding like compression or encryption.
     *
     * @minOccurs 1
     * @id 0x6240
     */
    ContentEncoding = 0x6240,
    /**
     * @interface {@link Elements.ContentEncodingOrder}
     * @definition
     * Defines the order to apply each `ContentEncoding` of the `ContentEncodings`.
     * The decoder/demuxer **MUST** start with the `ContentEncoding` with the highest `ContentEncodingOrder` and work its way down to the `ContentEncoding` with the lowest `ContentEncodingOrder`.
     * This value **MUST** be unique for each `ContentEncoding` found in the `ContentEncodings` of this `TrackEntry`.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x5031
     */
    ContentEncodingOrder = 0x5031,
    /**
     * @interface {@link Elements.ContentEncodingScope}
     * @definition
     * A bit field that describes which elements have been modified in this way.
     * Values (big-endian) can be OR'ed.
     *
     * @default 1
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x5032
     */
    ContentEncodingScope = 0x5032,
    /**
     * @interface {@link Elements.ContentEncodingType}
     * @definition
     * A value describing the kind of transformation that is applied.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x5033
     */
    ContentEncodingType = 0x5033,
    /**
     * @interface {@link Elements.ContentCompression}
     * @definition
     * Settings describing the compression used.
     * This element **MUST** be present if the value of `ContentEncodingType` is 0 and absent otherwise.
     * Each block **MUST** be decompressable, even if no previous block is available in order to not prevent seeking.
     *
     * @maxOccurs 1
     * @id 0x5034
     */
    ContentCompression = 0x5034,
    /**
     * @interface {@link Elements.ContentCompAlgo}
     * @definition
     * The compression algorithm used.
     *
     * @usage notes
     * Compression method "1" (bzlib) and "2" (lzo1x) lack proper documentation on the format, which limits implementation possibilities.
     * Due to licensing conflicts on commonly available libraries' compression methods, "2" (lzo1x) does not offer widespread interoperability.
     * A `Matroska Writer` **SHOULD NOT** use these compression methods by default.
     * A `Matroska Reader` **MAY** support methods "1" and "2" and **SHOULD** support other methods.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x4254
     */
    ContentCompAlgo = 0x4254,
    /**
     * @interface {@link Elements.ContentCompSettings}
     * @definition
     * Settings that might be needed by the decompressor. For Header Stripping (`ContentCompAlgo`=3),
     * the bytes that were removed from the beginning of each frame of the track.
     *
     * @maxOccurs 1
     * @id 0x4255
     */
    ContentCompSettings = 0x4255,
    /**
     * @interface {@link Elements.ContentEncryption}
     * @definition
     * Settings describing the encryption used.
     * This element **MUST** be present if the value of `ContentEncodingType` is 1 (encryption) and **MUST** be ignored otherwise.
     * A `Matroska Player` **MAY** support encryption.
     *
     * @maxOccurs 1
     * @id 0x5035
     */
    ContentEncryption = 0x5035,
    /**
     * @interface {@link Elements.ContentEncAlgo}
     * @definition
     * The encryption algorithm used.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x47E1
     */
    ContentEncAlgo = 0x47e1,
    /**
     * @interface {@link Elements.ContentEncKeyID}
     * @definition
     * For public key algorithms, the ID of the public key that the data was encrypted with.
     *
     * @maxOccurs 1
     * @id 0x47E2
     */
    ContentEncKeyID = 0x47e2,
    /**
     * @interface {@link Elements.ContentEncAESSettings}
     * @definition
     * Settings describing the encryption algorithm used.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x47E7
     */
    ContentEncAESSettings = 0x47e7,
    /**
     * @interface {@link Elements.AESSettingsCipherMode}
     * @definition
     * The AES cipher mode used in the encryption.
     *
     * @range not 0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x47E8
     */
    AESSettingsCipherMode = 0x47e8,
    /**
     * @interface {@link Elements.ContentSignature}
     * @definition
     * A cryptographic signature of the contents.
     *
     * @maxver 0
     * @maxOccurs 1
     * @id 0x47E3
     */
    ContentSignature = 0x47e3,
    /**
     * @interface {@link Elements.ContentSigKeyID}
     * @definition
     * This is the ID of the private key that the data was signed with.
     *
     * @maxver 0
     * @maxOccurs 1
     * @id 0x47E4
     */
    ContentSigKeyID = 0x47e4,
    /**
     * @interface {@link Elements.ContentSigAlgo}
     * @definition
     * The algorithm used for the signature.
     *
     * @default 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x47E5
     */
    ContentSigAlgo = 0x47e5,
    /**
     * @interface {@link Elements.ContentSigHashAlgo}
     * @definition
     * The hash algorithm used for the signature.
     *
     * @default 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x47E6
     */
    ContentSigHashAlgo = 0x47e6,
    /**
     * @interface {@link Elements.Cues}
     * @definition
     * A `Top-Level Element` to speed seeking access.
     * All entries are local to the `Segment`.
     *
     * @maxOccurs 1
     * @id 0x1C53BB6B
     */
    Cues = 0x1c53bb6b,
    /**
     * @interface {@link Elements.CuePoint}
     * @definition
     * Contains all information relative to a seek point in the `Segment`.
     *
     * @minOccurs 1
     * @id 0xBB
     */
    CuePoint = 0xbb,
    /**
     * @interface {@link Elements.CueTime}
     * @definition
     * Absolute timestamp of the seek point, expressed in Segment Ticks, which are based on `TimestampScale`; see (#timestamp-ticks).
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xB3
     */
    CueTime = 0xb3,
    /**
     * @interface {@link Elements.CueTrackPositions}
     * @definition
     * Contains positions for different tracks corresponding to the timestamp.
     *
     * @minOccurs 1
     * @id 0xB7
     */
    CueTrackPositions = 0xb7,
    /**
     * @interface {@link Elements.CueTrack}
     * @definition
     * The track for which a position is given.
     *
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xF7
     */
    CueTrack = 0xf7,
    /**
     * @interface {@link Elements.CueClusterPosition}
     * @definition
     * The `Segment Position` ((#segment-position)) of the `Cluster` containing the associated `Block`.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xF1
     */
    CueClusterPosition = 0xf1,
    /**
     * @interface {@link Elements.CueRelativePosition}
     * @definition
     * The relative position inside the `Cluster` of the referenced `SimpleBlock` or `BlockGroup`
     * with 0 being the first possible position for an element inside that `Cluster`.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0xF0
     */
    CueRelativePosition = 0xf0,
    /**
     * @interface {@link Elements.CueDuration}
     * @definition
     * The duration of the block, expressed in Segment Ticks, which are based on `TimestampScale`; see (#timestamp-ticks).
     * If missing, the track's `DefaultDuration` does not apply and no duration information is available in terms of the cues.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0xB2
     */
    CueDuration = 0xb2,
    /**
     * @interface {@link Elements.CueBlockNumber}
     * @definition
     * Number of the `Block` in the specified `Cluster`.
     *
     * @range not 0
     * @maxOccurs 1
     * @id 0x5378
     */
    CueBlockNumber = 0x5378,
    /**
     * @interface {@link Elements.CueCodecState}
     * @definition
     * The `Segment Position` ((#segment-position)) of the Codec State corresponding to this `Cues` element.
     * 0 means that the data is taken from the initial `TrackEntry`.
     *
     * @default 0
     * @minver 2
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xEA
     */
    CueCodecState = 0xea,
    /**
     * @interface {@link Elements.CueReference}
     * @definition
     * The `Clusters` containing the referenced `Blocks`.
     *
     * @minver 2
     * @id 0xDB
     */
    CueReference = 0xdb,
    /**
     * @interface {@link Elements.CueRefTime}
     * @definition
     * Timestamp of the referenced `Block`, expressed in Segment Ticks which is based on `TimestampScale`; see (#timestamp-ticks).
     *
     * @minver 2
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x96
     */
    CueRefTime = 0x96,
    /**
     * @interface {@link Elements.CueRefCluster}
     * @definition
     * The `Segment Position` of the `Cluster` containing the referenced `Block`.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x97
     */
    CueRefCluster = 0x97,
    /**
     * @interface {@link Elements.CueRefNumber}
     * @definition
     * Number of the referenced `Block` of Track X in the specified `Cluster`.
     *
     * @default 1
     * @range not 0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x535F
     */
    CueRefNumber = 0x535f,
    /**
     * @interface {@link Elements.CueRefCodecState}
     * @definition
     * The `Segment Position` of the Codec State corresponding to this referenced element.
     * 0 means that the data is taken from the initial `TrackEntry`.
     *
     * @default 0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xEB
     */
    CueRefCodecState = 0xeb,
    /**
     * @interface {@link Elements.Attachments}
     * @definition
     * Contains attached files.
     *
     * @maxOccurs 1
     * @id 0x1941A469
     */
    Attachments = 0x1941a469,
    /**
     * @interface {@link Elements.AttachedFile}
     * @definition
     * An attached file.
     *
     * @minOccurs 1
     * @id 0x61A7
     */
    AttachedFile = 0x61a7,
    /**
     * @interface {@link Elements.FileDescription}
     * @definition
     * A human-friendly name for the attached file.
     *
     * @maxOccurs 1
     * @id 0x467E
     */
    FileDescription = 0x467e,
    /**
     * @interface {@link Elements.FileName}
     * @definition
     * Filename of the attached file.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x466E
     */
    FileName = 0x466e,
    /**
     * @interface {@link Elements.FileMediaType}
     * @definition
     * Media type of the file following the format described in [@!RFC6838].
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x4660
     */
    FileMediaType = 0x4660,
    /**
     * @interface {@link Elements.FileData}
     * @definition
     * The data of the file.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x465C
     */
    FileData = 0x465c,
    /**
     * @interface {@link Elements.FileUID}
     * @definition
     * UID representing the file, as random as possible.
     *
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x46AE
     */
    FileUID = 0x46ae,
    /**
     * @interface {@link Elements.FileReferral}
     * @definition
     * A binary value that a track/codec can refer to when the attachment is needed.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x4675
     */
    FileReferral = 0x4675,
    /**
     * @interface {@link Elements.FileUsedStartTime}
     * @definition
     * The timestamp at which this optimized font attachment comes into context, expressed in Segment Ticks, which are based on `TimestampScale`. See [@?DivXWorldFonts].
     *
     * @usage notes
     * This element is reserved for future use and if written **MUST** be the segment start timestamp.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x4661
     */
    FileUsedStartTime = 0x4661,
    /**
     * @interface {@link Elements.FileUsedEndTime}
     * @definition
     * The timestamp at which this optimized font attachment goes out of context, expressed in Segment Ticks, which are based on `TimestampScale`. See [@?DivXWorldFonts].
     *
     * @usage notes
     * This element is reserved for future use and if written **MUST** be the segment end timestamp.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x4662
     */
    FileUsedEndTime = 0x4662,
    /**
     * @interface {@link Elements.Chapters}
     * @definition
     * A system to define basic menus and partition data.
     * For more detailed information, see (#chapters).
     *
     * @maxOccurs 1
     * @id 0x1043A770
     */
    Chapters = 0x1043a770,
    /**
     * @interface {@link Elements.EditionEntry}
     * @definition
     * Contains all information about a `Segment` edition.
     *
     * @minOccurs 1
     * @id 0x45B9
     */
    EditionEntry = 0x45b9,
    /**
     * @interface {@link Elements.EditionUID}
     * @definition
     * A UID that identifies the edition. It's useful for tagging an edition.
     *
     * @range not 0
     * @maxOccurs 1
     * @id 0x45BC
     */
    EditionUID = 0x45bc,
    /**
     * @interface {@link Elements.EditionFlagHidden}
     * @definition
     * Set to 1 if an edition is hidden. Hidden editions **SHOULD NOT** be available to the user interface
     * (but still be available to Control Tracks; see (#chapter-flags) on `Chapter` flags).
     *
     * @default 0
     * @range 0-1
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x45BD
     */
    EditionFlagHidden = 0x45bd,
    /**
     * @interface {@link Elements.EditionFlagDefault}
     * @definition
     * Set to 1 if the edition **SHOULD** be used as the default one.
     *
     * @default 0
     * @range 0-1
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x45DB
     */
    EditionFlagDefault = 0x45db,
    /**
     * @interface {@link Elements.EditionFlagOrdered}
     * @definition
     * Set to 1 if the chapters can be defined multiple times and the order to play them is enforced; see (#editionflagordered).
     *
     * @default 0
     * @range 0-1
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x45DD
     */
    EditionFlagOrdered = 0x45dd,
    /**
     * @interface {@link Elements.EditionDisplay}
     * @definition
     * Contains a possible string to use for the edition display for the given languages.
     *
     * @minver 5
     * @id 0x4520
     */
    EditionDisplay = 0x4520,
    /**
     * @interface {@link Elements.EditionString}
     * @definition
     * Contains the string to use as the edition name.
     *
     * @minver 5
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x4521
     */
    EditionString = 0x4521,
    /**
     * @interface {@link Elements.EditionLanguageIETF}
     * @definition
     * One language corresponding to the EditionString,
     * in the form defined in [@!RFC5646]; see (#language-codes) on language codes.
     *
     * @minver 5
     * @id 0x45E4
     */
    EditionLanguageIETF = 0x45e4,
    /**
     * @interface {@link Elements.ChapterAtom}
     * @definition
     * Contains the atom information to use as the chapter atom (applies to all tracks).
     *
     * @minOccurs 1
     * @id 0xB6
     */
    ChapterAtom = 0xb6,
    /**
     * @interface {@link Elements.ChapterUID}
     * @definition
     * A UID that identifies the `Chapter`.
     *
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x73C4
     */
    ChapterUID = 0x73c4,
    /**
     * @interface {@link Elements.ChapterStringUID}
     * @definition
     * A unique string ID that identifies the `Chapter`.
     * For example, it is used as the storage for cue identifier values [@?WebVTT].
     *
     * @minver 3
     * @maxOccurs 1
     * @id 0x5654
     */
    ChapterStringUID = 0x5654,
    /**
     * @interface {@link Elements.ChapterTimeStart}
     * @definition
     * Timestamp of the start of `Chapter`, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks).
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x91
     */
    ChapterTimeStart = 0x91,
    /**
     * @interface {@link Elements.ChapterTimeEnd}
     * @definition
     * Timestamp of the end of `Chapter` (timestamp excluded), expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks).
     * The value **MUST** be greater than or equal to the `ChapterTimeStart` of the same `ChapterAtom`.
     *
     * @usage notes
     * With the `ChapterTimeEnd` timestamp value being excluded, it **MUST** take into account the duration of
     * the last frame it includes, especially for the `ChapterAtom` using the last frames of the `Segment`.
     *
     * @maxOccurs 1
     * @id 0x92
     */
    ChapterTimeEnd = 0x92,
    /**
     * @interface {@link Elements.ChapterFlagHidden}
     * @definition
     * Set to 1 if a chapter is hidden. Hidden chapters **SHOULD NOT** be available to the user interface
     * (but still be available to Control Tracks; see (#chapterflaghidden) on `Chapter` flags).
     *
     * @default 0
     * @range 0-1
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x98
     */
    ChapterFlagHidden = 0x98,
    /**
     * @interface {@link Elements.ChapterFlagEnabled}
     * @definition
     * Set to 1 if the chapter is enabled. It can be enabled/disabled by a Control Track.
     * When disabled, the movie **SHOULD** skip all the content between the TimeStart and TimeEnd of this chapter; see (#chapter-flags) on `Chapter` flags.
     *
     * @default 1
     * @range 0-1
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x4598
     */
    ChapterFlagEnabled = 0x4598,
    /**
     * @interface {@link Elements.ChapterSegmentUUID}
     * @definition
     * The `SegmentUUID` of another `Segment` to play during this chapter.
     *
     * @usage notes
     * The value **MUST NOT** be the `SegmentUUID` value of the `Segment` it belongs to.
     *
     * @maxOccurs 1
     * @id 0x6E67
     */
    ChapterSegmentUUID = 0x6e67,
    /**
     * @interface {@link Elements.ChapterSkipType}
     * @definition
     * Indicates what type of content the `ChapterAtom` contains and might be skipped. It can be used to automatically skip content based on the type.
     * If a `ChapterAtom` is inside a `ChapterAtom` that has a `ChapterSkipType` set, it **MUST NOT** have a `ChapterSkipType` or have a `ChapterSkipType` with the same value as it's parent `ChapterAtom`.
     * If the `ChapterAtom` doesn't contain a `ChapterTimeEnd`, the value of the `ChapterSkipType` is only valid until the next `ChapterAtom` with a `ChapterSkipType` value or the end of the file.
     *
     * @minver 5
     * @maxOccurs 1
     * @id 0x4588
     */
    ChapterSkipType = 0x4588,
    /**
     * @interface {@link Elements.ChapterSegmentEditionUID}
     * @definition
     * The `EditionUID` to play from the `Segment` linked in `ChapterSegmentUUID`.
     * If `ChapterSegmentEditionUID` is undeclared, then no `Edition` of the `Linked Segment` is used; see (#medium-linking) on Medium-Linking `Segments`.
     *
     * @range not 0
     * @maxOccurs 1
     * @id 0x6EBC
     */
    ChapterSegmentEditionUID = 0x6ebc,
    /**
     * @interface {@link Elements.ChapterPhysicalEquiv}
     * @definition
     * Specifies the physical equivalent of this `ChapterAtom`, e.g., "DVD" (60) or "SIDE" (50);
     * see (#physical-types) for a complete list of values.
     *
     * @maxOccurs 1
     * @id 0x63C3
     */
    ChapterPhysicalEquiv = 0x63c3,
    /**
     * @interface {@link Elements.ChapterTrack}
     * @definition
     * List of tracks on which the chapter applies. If this element is not present, all tracks apply.
     *
     * @maxOccurs 1
     * @id 0x8F
     */
    ChapterTrack = 0x8f,
    /**
     * @interface {@link Elements.ChapterTrackUID}
     * @definition
     * UID of the `Track` to apply this chapter to.
     * In the absence of a control track, choosing this chapter will select the listed `Tracks` and deselect unlisted tracks.
     * Absence of this element indicates that the `Chapter` **SHOULD** be applied to any currently used `Tracks`.
     *
     * @range not 0
     * @minOccurs 1
     * @id 0x89
     */
    ChapterTrackUID = 0x89,
    /**
     * @interface {@link Elements.ChapterDisplay}
     * @definition
     * Contains all possible strings to use for the chapter display.
     *
     * @id 0x80
     */
    ChapterDisplay = 0x80,
    /**
     * @interface {@link Elements.ChapString}
     * @definition
     * Contains the string to use as the chapter atom.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x85
     */
    ChapString = 0x85,
    /**
     * @interface {@link Elements.ChapLanguage}
     * @definition
     * A language corresponding to the string,
     * in the Matroska languages form; see (#language-codes) on language codes.
     * This element **MUST** be ignored if a `ChapLanguageBCP47` element is used within the same `ChapterDisplay` element.
     *
     * @default eng
     * @minOccurs 1
     * @id 0x437C
     */
    ChapLanguage = 0x437c,
    /**
     * @interface {@link Elements.ChapLanguageBCP47}
     * @definition
     * A language corresponding to the `ChapString`,
     * in the form defined in [@!RFC5646]; see (#language-codes) on language codes.
     * If a `ChapLanguageBCP47` element is used, then any `ChapLanguage` and `ChapCountry` elements used in the same `ChapterDisplay` **MUST** be ignored.
     *
     * @minver 4
     * @id 0x437D
     */
    ChapLanguageBCP47 = 0x437d,
    /**
     * @interface {@link Elements.ChapCountry}
     * @definition
     * A country corresponding to the string,
     * in the Matroska countries form; see (#country-codes) on country codes.
     * This element **MUST** be ignored if a `ChapLanguageBCP47` element is used within the same `ChapterDisplay` element.
     *
     * @id 0x437E
     */
    ChapCountry = 0x437e,
    /**
     * @interface {@link Elements.ChapProcess}
     * @definition
     * Contains all the commands associated with the Atom.
     *
     * @id 0x6944
     */
    ChapProcess = 0x6944,
    /**
     * @interface {@link Elements.ChapProcessCodecID}
     * @definition
     * Contains the type of the codec used for processing.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x6955
     */
    ChapProcessCodecID = 0x6955,
    /**
     * @interface {@link Elements.ChapProcessPrivate}
     * @definition
     * Optional data attached to the `ChapProcessCodecID` information.
     *     For `ChapProcessCodecID` = 1, it is the "DVD level" equivalent; see (#menu-features) on DVD menus.
     *
     * @maxOccurs 1
     * @id 0x450D
     */
    ChapProcessPrivate = 0x450d,
    /**
     * @interface {@link Elements.ChapProcessCommand}
     * @definition
     * Contains all the commands associated with the Atom.
     *
     * @id 0x6911
     */
    ChapProcessCommand = 0x6911,
    /**
     * @interface {@link Elements.ChapProcessTime}
     * @definition
     * Defines when the process command **SHOULD** be handled.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x6922
     */
    ChapProcessTime = 0x6922,
    /**
     * @interface {@link Elements.ChapProcessData}
     * @definition
     * Contains the command information.
     * The data **SHOULD** be interpreted depending on the `ChapProcessCodecID` value. For `ChapProcessCodecID` = 1,
     * the data correspond to the binary DVD cell pre/post commands; see (#menu-features) on DVD menus.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x6933
     */
    ChapProcessData = 0x6933,
    /**
     * @interface {@link Elements.Tags}
     * @definition
     * Element containing metadata describing `Tracks`, `Editions`, `Chapters`, `Attachments`, or the `Segment` as a whole.
     * A list of valid tags can be found in [@?I-D.ietf-cellar-tags].
     *
     * @id 0x1254C367
     */
    Tags = 0x1254c367,
    /**
     * @interface {@link Elements.Tag}
     * @definition
     * A single metadata descriptor.
     *
     * @minOccurs 1
     * @id 0x7373
     */
    Tag = 0x7373,
    /**
     * @interface {@link Elements.Targets}
     * @definition
     * Specifies which other elements the metadata represented by the tag value applies to.
     * If empty or omitted, then the tag value describes everything in the `Segment`.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x63C0
     */
    Targets = 0x63c0,
    /**
     * @interface {@link Elements.TargetTypeValue}
     * @definition
     * A number to indicate the logical level of the target.
     *
     * @usage notes
     * The `TargetTypeValue` values are meant to be compared.
     *     Higher values **MUST** correspond to a logical level that contains the lower logical level `TargetTypeValue` values.
     *
     * @default 50
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x68CA
     */
    TargetTypeValue = 0x68ca,
    /**
     * @interface {@link Elements.TargetType}
     * @definition
     * An informational string that can be used to display the logical level of the target, such as "ALBUM", "TRACK", "MOVIE", "CHAPTER", etc.
     *
     * @maxOccurs 1
     * @id 0x63CA
     */
    TargetType = 0x63ca,
    /**
     * @interface {@link Elements.TagTrackUID}
     * @definition
     * A UID that identifies the `Track(s)` that the tags belong to.
     *
     * @usage notes
     * If the value is 0 at this level, the tags apply to all tracks in the `Segment`.
     * If set to any other value, it **MUST** match the `TrackUID` value of a track found in this `Segment`.
     *
     * @default 0
     * @id 0x63C5
     */
    TagTrackUID = 0x63c5,
    /**
     * @interface {@link Elements.TagEditionUID}
     * @definition
     * A UID that identifies the `EditionEntry(s)` that the tags belong to.
     *
     * @usage notes
     * If the value is 0 at this level, the tags apply to all editions in the `Segment`.
     * If set to any other value, it **MUST** match the `EditionUID` value of an edition found in this `Segment`.
     *
     * @default 0
     * @id 0x63C9
     */
    TagEditionUID = 0x63c9,
    /**
     * @interface {@link Elements.TagChapterUID}
     * @definition
     * A UID that identifies the `Chapter(s)` that the tags belong to.
     *
     * @usage notes
     * If the value is 0 at this level, the tags apply to all chapters in the `Segment`.
     * If set to any other value, it **MUST** match the `ChapterUID` value of a chapter found in this `Segment`.
     *
     * @default 0
     * @id 0x63C4
     */
    TagChapterUID = 0x63c4,
    /**
     * @interface {@link Elements.TagAttachmentUID}
     * @definition
     * A UID that identifies the Attachment(s) that the tags belong to.
     *
     * @usage notes
     * If the value is 0 at this level, the tags apply to all the attachments in the `Segment`.
     * If set to any other value, it **MUST** match the `FileUID` value of an attachment found in this `Segment`.
     *
     * @default 0
     * @id 0x63C6
     */
    TagAttachmentUID = 0x63c6,
    /**
     * @interface {@link Elements.SimpleTag}
     * @definition
     * Contains general information about the target.
     *
     * @minOccurs 1
     * @id 0x67C8
     */
    SimpleTag = 0x67c8,
    /**
     * @interface {@link Elements.TagName}
     * @definition
     * The name of the tag value that is going to be stored.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x45A3
     */
    TagName = 0x45a3,
    /**
     * @interface {@link Elements.TagLanguage}
     * @definition
     * Specifies the language of the specified tag
     * in the Matroska languages form; see (#language-codes) on language codes.
     * This element **MUST** be ignored if the `TagLanguageBCP47` element is used within the same `SimpleTag` element.
     *
     * @default und
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x447A
     */
    TagLanguage = 0x447a,
    /**
     * @interface {@link Elements.TagLanguageBCP47}
     * @definition
     * The language used in the `TagString`,
     * in the form defined in [@!RFC5646]; see (#language-codes) on language codes.
     * If this element is used, then any `TagLanguage` elements used in the same `SimpleTag` **MUST** be ignored.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x447B
     */
    TagLanguageBCP47 = 0x447b,
    /**
     * @interface {@link Elements.TagDefault}
     * @definition
     * A boolean value to indicate if this is the default/original language to use for the given tag.
     *
     * @default 1
     * @range 0-1
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x4484
     */
    TagDefault = 0x4484,
    /**
     * @interface {@link Elements.TagDefaultBogus}
     * @definition
     * A variant of the `TagDefault` element with a bogus element ID; see (#tagdefault-element).
     *
     * @default 1
     * @range 0-1
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x44B4
     */
    TagDefaultBogus = 0x44b4,
    /**
     * @interface {@link Elements.TagString}
     * @definition
     * The tag value.
     *
     * @maxOccurs 1
     * @id 0x4487
     */
    TagString = 0x4487,
    /**
     * @interface {@link Elements.TagBinary}
     * @definition
     * The tag value if it is binary. Note that this cannot be used in the same `SimpleTag` as `TagString`.
     *
     * @maxOccurs 1
     * @id 0x4485
     */
    TagBinary = 0x4485
}

export enum ElementType {
    Binary = 'binary',
    Date = 'date',
    Float = 'float',
    Integer = 'integer',
    Master = 'master',
    String = 'string',
    UTF8 = 'utf-8',
    Uinteger = 'uinteger'
}

export interface Element {
    name: string;
    path: string;
    pathArray: (MatroskaElements | EbmlElements)[];
    id: string;
    type: ElementType;
    maxOccurs?: string;
    recurring?: string;
    minOccurs?: string;
    unknownsizeallowed?: string;
    default?: string;
    minver?: string;
    maxver?: string;
    range?: string;
    length?: string;
    recursive?: string;
}

export const ElementInfo: { [key: number]: Element | undefined } = {
    [EbmlElements.EBMLHead]: {
        name: 'EBML',
        path: 'EBML',
        pathArray: [EbmlElements.EBMLHead],
        id: '0x1a45dfa3',
        type: ElementType.Master
    },
    [EbmlElements.EBMLVersion]: {
        name: 'EBMLVersion',
        path: 'EBMLEBMLVersion',
        pathArray: [EbmlElements.EBMLHead, EbmlElements.EBMLVersion],
        id: '0x4286',
        type: ElementType.Uinteger,
        minOccurs: '1',
        maxOccurs: '1'
    },
    [EbmlElements.EBMLReadVersion]: {
        name: 'EBMLReadVersion',
        path: 'EBMLEBMLReadVersion',
        pathArray: [EbmlElements.EBMLHead, EbmlElements.EBMLReadVersion],
        id: '0x42F7',
        type: ElementType.Uinteger,
        minOccurs: '1',
        maxOccurs: '1'
    },
    [EbmlElements.DocType]: {
        name: 'DocType',
        path: 'EBMLDocType',
        pathArray: [EbmlElements.EBMLHead, EbmlElements.DocType],
        id: '0x4282',
        type: ElementType.String,
        minOccurs: '1',
        maxOccurs: '1'
    },
    [EbmlElements.DocTypeVersion]: {
        name: 'DocTypeVersion',
        path: 'EBMLDocTypeVersion',
        pathArray: [EbmlElements.EBMLHead, EbmlElements.DocTypeVersion],
        id: '0x4287',
        type: ElementType.Uinteger,
        minOccurs: '1',
        maxOccurs: '1'
    },
    [EbmlElements.DocTypeReadVersion]: {
        name: 'DocTypeReadVersion',
        path: 'EBMLDocTypeReadVersion',
        pathArray: [EbmlElements.EBMLHead, EbmlElements.DocTypeReadVersion],
        id: '0x4285',
        type: ElementType.Uinteger,
        minOccurs: '1',
        maxOccurs: '1'
    },
    [MatroskaElements.EBMLMaxIDLength]: {
        name: 'EBMLMaxIDLength',
        path: '\\EBML\\EBMLMaxIDLength',
        id: '0x42F2',
        type: ElementType.Uinteger,
        range: '4',
        default: '4',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [EbmlElements.EBMLHead, MatroskaElements.EBMLMaxIDLength]
    },
    [MatroskaElements.EBMLMaxSizeLength]: {
        name: 'EBMLMaxSizeLength',
        path: '\\EBML\\EBMLMaxSizeLength',
        id: '0x42F3',
        type: ElementType.Uinteger,
        range: '1-8',
        default: '8',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [EbmlElements.EBMLHead, MatroskaElements.EBMLMaxSizeLength]
    },
    [MatroskaElements.Segment]: {
        name: 'Segment',
        path: '\\Segment',
        id: '0x18538067',
        type: ElementType.Master,
        minOccurs: '1',
        maxOccurs: '1',
        unknownsizeallowed: '1',
        pathArray: [MatroskaElements.Segment]
    },
    [MatroskaElements.SeekHead]: {
        name: 'SeekHead',
        path: '\\Segment\\SeekHead',
        id: '0x114D9B74',
        type: ElementType.Master,
        maxOccurs: '2',
        pathArray: [MatroskaElements.Segment, MatroskaElements.SeekHead]
    },
    [MatroskaElements.Seek]: {
        name: 'Seek',
        path: '\\Segment\\SeekHead\\Seek',
        id: '0x4DBB',
        type: ElementType.Master,
        minOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.SeekHead, MatroskaElements.Seek]
    },
    [MatroskaElements.SeekID]: {
        name: 'SeekID',
        path: '\\Segment\\SeekHead\\Seek\\SeekID',
        id: '0x53AB',
        type: ElementType.Binary,
        length: '4',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.SeekHead,
            MatroskaElements.Seek,
            MatroskaElements.SeekID
        ]
    },
    [MatroskaElements.SeekPosition]: {
        name: 'SeekPosition',
        path: '\\Segment\\SeekHead\\Seek\\SeekPosition',
        id: '0x53AC',
        type: ElementType.Uinteger,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.SeekHead,
            MatroskaElements.Seek,
            MatroskaElements.SeekPosition
        ]
    },
    [MatroskaElements.Info]: {
        name: 'Info',
        path: '\\Segment\\Info',
        id: '0x1549A966',
        type: ElementType.Master,
        minOccurs: '1',
        maxOccurs: '1',
        recurring: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Info]
    },
    [MatroskaElements.SegmentUUID]: {
        name: 'SegmentUUID',
        path: '\\Segment\\Info\\SegmentUUID',
        id: '0x73A4',
        type: ElementType.Binary,
        length: '16',
        maxOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Info, MatroskaElements.SegmentUUID]
    },
    [MatroskaElements.SegmentFilename]: {
        name: 'SegmentFilename',
        path: '\\Segment\\Info\\SegmentFilename',
        id: '0x7384',
        type: ElementType.UTF8,
        maxOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Info, MatroskaElements.SegmentFilename]
    },
    [MatroskaElements.PrevUUID]: {
        name: 'PrevUUID',
        path: '\\Segment\\Info\\PrevUUID',
        id: '0x3CB923',
        type: ElementType.Binary,
        length: '16',
        maxOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Info, MatroskaElements.PrevUUID]
    },
    [MatroskaElements.PrevFilename]: {
        name: 'PrevFilename',
        path: '\\Segment\\Info\\PrevFilename',
        id: '0x3C83AB',
        type: ElementType.UTF8,
        maxOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Info, MatroskaElements.PrevFilename]
    },
    [MatroskaElements.NextUUID]: {
        name: 'NextUUID',
        path: '\\Segment\\Info\\NextUUID',
        id: '0x3EB923',
        type: ElementType.Binary,
        length: '16',
        maxOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Info, MatroskaElements.NextUUID]
    },
    [MatroskaElements.NextFilename]: {
        name: 'NextFilename',
        path: '\\Segment\\Info\\NextFilename',
        id: '0x3E83BB',
        type: ElementType.UTF8,
        maxOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Info, MatroskaElements.NextFilename]
    },
    [MatroskaElements.SegmentFamily]: {
        name: 'SegmentFamily',
        path: '\\Segment\\Info\\SegmentFamily',
        id: '0x4444',
        type: ElementType.Binary,
        length: '16',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Info, MatroskaElements.SegmentFamily]
    },
    [MatroskaElements.ChapterTranslate]: {
        name: 'ChapterTranslate',
        path: '\\Segment\\Info\\ChapterTranslate',
        id: '0x6924',
        type: ElementType.Master,
        pathArray: [MatroskaElements.Segment, MatroskaElements.Info, MatroskaElements.ChapterTranslate]
    },
    [MatroskaElements.ChapterTranslateID]: {
        name: 'ChapterTranslateID',
        path: '\\Segment\\Info\\ChapterTranslate\\ChapterTranslateID',
        id: '0x69A5',
        type: ElementType.Binary,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Info,
            MatroskaElements.ChapterTranslate,
            MatroskaElements.ChapterTranslateID
        ]
    },
    [MatroskaElements.ChapterTranslateCodec]: {
        name: 'ChapterTranslateCodec',
        path: '\\Segment\\Info\\ChapterTranslate\\ChapterTranslateCodec',
        id: '0x69BF',
        type: ElementType.Uinteger,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Info,
            MatroskaElements.ChapterTranslate,
            MatroskaElements.ChapterTranslateCodec
        ]
    },
    [MatroskaElements.ChapterTranslateEditionUID]: {
        name: 'ChapterTranslateEditionUID',
        path: '\\Segment\\Info\\ChapterTranslate\\ChapterTranslateEditionUID',
        id: '0x69FC',
        type: ElementType.Uinteger,
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Info,
            MatroskaElements.ChapterTranslate,
            MatroskaElements.ChapterTranslateEditionUID
        ]
    },
    [MatroskaElements.TimestampScale]: {
        name: 'TimestampScale',
        path: '\\Segment\\Info\\TimestampScale',
        id: '0x2AD7B1',
        type: ElementType.Uinteger,
        range: 'not 0',
        default: '1000000',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Info, MatroskaElements.TimestampScale]
    },
    [MatroskaElements.Duration]: {
        name: 'Duration',
        path: '\\Segment\\Info\\Duration',
        id: '0x4489',
        type: ElementType.Float,
        range: '> 0x0p+0',
        maxOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Info, MatroskaElements.Duration]
    },
    [MatroskaElements.DateUTC]: {
        name: 'DateUTC',
        path: '\\Segment\\Info\\DateUTC',
        id: '0x4461',
        type: ElementType.Date,
        maxOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Info, MatroskaElements.DateUTC]
    },
    [MatroskaElements.Title]: {
        name: 'Title',
        path: '\\Segment\\Info\\Title',
        id: '0x7BA9',
        type: ElementType.UTF8,
        maxOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Info, MatroskaElements.Title]
    },
    [MatroskaElements.MuxingApp]: {
        name: 'MuxingApp',
        path: '\\Segment\\Info\\MuxingApp',
        id: '0x4D80',
        type: ElementType.UTF8,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Info, MatroskaElements.MuxingApp]
    },
    [MatroskaElements.WritingApp]: {
        name: 'WritingApp',
        path: '\\Segment\\Info\\WritingApp',
        id: '0x5741',
        type: ElementType.UTF8,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Info, MatroskaElements.WritingApp]
    },
    [MatroskaElements.Cluster]: {
        name: 'Cluster',
        path: '\\Segment\\Cluster',
        id: '0x1F43B675',
        type: ElementType.Master,
        unknownsizeallowed: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Cluster]
    },
    [MatroskaElements.Timestamp]: {
        name: 'Timestamp',
        path: '\\Segment\\Cluster\\Timestamp',
        id: '0xE7',
        type: ElementType.Uinteger,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Cluster, MatroskaElements.Timestamp]
    },
    [MatroskaElements.SilentTracks]: {
        name: 'SilentTracks',
        path: '\\Segment\\Cluster\\SilentTracks',
        id: '0x5854',
        type: ElementType.Master,
        minver: '0',
        maxver: '0',
        maxOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Cluster, MatroskaElements.SilentTracks]
    },
    [MatroskaElements.SilentTrackNumber]: {
        name: 'SilentTrackNumber',
        path: '\\Segment\\Cluster\\SilentTracks\\SilentTrackNumber',
        id: '0x58D7',
        type: ElementType.Uinteger,
        minver: '0',
        maxver: '0',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.SilentTracks,
            MatroskaElements.SilentTrackNumber
        ]
    },
    [MatroskaElements.Position]: {
        name: 'Position',
        path: '\\Segment\\Cluster\\Position',
        id: '0xA7',
        type: ElementType.Uinteger,
        maxver: '4',
        maxOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Cluster, MatroskaElements.Position]
    },
    [MatroskaElements.PrevSize]: {
        name: 'PrevSize',
        path: '\\Segment\\Cluster\\PrevSize',
        id: '0xAB',
        type: ElementType.Uinteger,
        maxOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Cluster, MatroskaElements.PrevSize]
    },
    [MatroskaElements.SimpleBlock]: {
        name: 'SimpleBlock',
        path: '\\Segment\\Cluster\\SimpleBlock',
        id: '0xA3',
        type: ElementType.Binary,
        minver: '2',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Cluster, MatroskaElements.SimpleBlock]
    },
    [MatroskaElements.BlockGroup]: {
        name: 'BlockGroup',
        path: '\\Segment\\Cluster\\BlockGroup',
        id: '0xA0',
        type: ElementType.Master,
        pathArray: [MatroskaElements.Segment, MatroskaElements.Cluster, MatroskaElements.BlockGroup]
    },
    [MatroskaElements.Block]: {
        name: 'Block',
        path: '\\Segment\\Cluster\\BlockGroup\\Block',
        id: '0xA1',
        type: ElementType.Binary,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.Block
        ]
    },
    [MatroskaElements.BlockVirtual]: {
        name: 'BlockVirtual',
        path: '\\Segment\\Cluster\\BlockGroup\\BlockVirtual',
        id: '0xA2',
        type: ElementType.Binary,
        minver: '0',
        maxver: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.BlockVirtual
        ]
    },
    [MatroskaElements.BlockAdditions]: {
        name: 'BlockAdditions',
        path: '\\Segment\\Cluster\\BlockGroup\\BlockAdditions',
        id: '0x75A1',
        type: ElementType.Master,
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.BlockAdditions
        ]
    },
    [MatroskaElements.BlockMore]: {
        name: 'BlockMore',
        path: '\\Segment\\Cluster\\BlockGroup\\BlockAdditions\\BlockMore',
        id: '0xA6',
        type: ElementType.Master,
        minOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.BlockAdditions,
            MatroskaElements.BlockMore
        ]
    },
    [MatroskaElements.BlockAdditional]: {
        name: 'BlockAdditional',
        path: '\\Segment\\Cluster\\BlockGroup\\BlockAdditions\\BlockMore\\BlockAdditional',
        id: '0xA5',
        type: ElementType.Binary,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.BlockAdditions,
            MatroskaElements.BlockMore,
            MatroskaElements.BlockAdditional
        ]
    },
    [MatroskaElements.BlockAddID]: {
        name: 'BlockAddID',
        path: '\\Segment\\Cluster\\BlockGroup\\BlockAdditions\\BlockMore\\BlockAddID',
        id: '0xEE',
        type: ElementType.Uinteger,
        range: 'not 0',
        default: '1',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.BlockAdditions,
            MatroskaElements.BlockMore,
            MatroskaElements.BlockAddID
        ]
    },
    [MatroskaElements.BlockDuration]: {
        name: 'BlockDuration',
        path: '\\Segment\\Cluster\\BlockGroup\\BlockDuration',
        id: '0x9B',
        type: ElementType.Uinteger,
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.BlockDuration
        ]
    },
    [MatroskaElements.ReferencePriority]: {
        name: 'ReferencePriority',
        path: '\\Segment\\Cluster\\BlockGroup\\ReferencePriority',
        id: '0xFA',
        type: ElementType.Uinteger,
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.ReferencePriority
        ]
    },
    [MatroskaElements.ReferenceBlock]: {
        name: 'ReferenceBlock',
        path: '\\Segment\\Cluster\\BlockGroup\\ReferenceBlock',
        id: '0xFB',
        type: ElementType.Integer,
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.ReferenceBlock
        ]
    },
    [MatroskaElements.ReferenceVirtual]: {
        name: 'ReferenceVirtual',
        path: '\\Segment\\Cluster\\BlockGroup\\ReferenceVirtual',
        id: '0xFD',
        type: ElementType.Integer,
        minver: '0',
        maxver: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.ReferenceVirtual
        ]
    },
    [MatroskaElements.CodecState]: {
        name: 'CodecState',
        path: '\\Segment\\Cluster\\BlockGroup\\CodecState',
        id: '0xA4',
        type: ElementType.Binary,
        minver: '2',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.CodecState
        ]
    },
    [MatroskaElements.DiscardPadding]: {
        name: 'DiscardPadding',
        path: '\\Segment\\Cluster\\BlockGroup\\DiscardPadding',
        id: '0x75A2',
        type: ElementType.Integer,
        minver: '4',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.DiscardPadding
        ]
    },
    [MatroskaElements.Slices]: {
        name: 'Slices',
        path: '\\Segment\\Cluster\\BlockGroup\\Slices',
        id: '0x8E',
        type: ElementType.Master,
        minver: '0',
        maxver: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.Slices
        ]
    },
    [MatroskaElements.TimeSlice]: {
        name: 'TimeSlice',
        path: '\\Segment\\Cluster\\BlockGroup\\Slices\\TimeSlice',
        id: '0xE8',
        type: ElementType.Master,
        minver: '0',
        maxver: '0',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.Slices,
            MatroskaElements.TimeSlice
        ]
    },
    [MatroskaElements.LaceNumber]: {
        name: 'LaceNumber',
        path: '\\Segment\\Cluster\\BlockGroup\\Slices\\TimeSlice\\LaceNumber',
        id: '0xCC',
        type: ElementType.Uinteger,
        minver: '0',
        maxver: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.Slices,
            MatroskaElements.TimeSlice,
            MatroskaElements.LaceNumber
        ]
    },
    [MatroskaElements.FrameNumber]: {
        name: 'FrameNumber',
        path: '\\Segment\\Cluster\\BlockGroup\\Slices\\TimeSlice\\FrameNumber',
        id: '0xCD',
        type: ElementType.Uinteger,
        minver: '0',
        maxver: '0',
        default: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.Slices,
            MatroskaElements.TimeSlice,
            MatroskaElements.FrameNumber
        ]
    },
    [MatroskaElements.BlockAdditionID]: {
        name: 'BlockAdditionID',
        path: '\\Segment\\Cluster\\BlockGroup\\Slices\\TimeSlice\\BlockAdditionID',
        id: '0xCB',
        type: ElementType.Uinteger,
        minver: '0',
        maxver: '0',
        default: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.Slices,
            MatroskaElements.TimeSlice,
            MatroskaElements.BlockAdditionID
        ]
    },
    [MatroskaElements.Delay]: {
        name: 'Delay',
        path: '\\Segment\\Cluster\\BlockGroup\\Slices\\TimeSlice\\Delay',
        id: '0xCE',
        type: ElementType.Uinteger,
        minver: '0',
        maxver: '0',
        default: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.Slices,
            MatroskaElements.TimeSlice,
            MatroskaElements.Delay
        ]
    },
    [MatroskaElements.SliceDuration]: {
        name: 'SliceDuration',
        path: '\\Segment\\Cluster\\BlockGroup\\Slices\\TimeSlice\\SliceDuration',
        id: '0xCF',
        type: ElementType.Uinteger,
        minver: '0',
        maxver: '0',
        default: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.Slices,
            MatroskaElements.TimeSlice,
            MatroskaElements.SliceDuration
        ]
    },
    [MatroskaElements.ReferenceFrame]: {
        name: 'ReferenceFrame',
        path: '\\Segment\\Cluster\\BlockGroup\\ReferenceFrame',
        id: '0xC8',
        type: ElementType.Master,
        minver: '0',
        maxver: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.ReferenceFrame
        ]
    },
    [MatroskaElements.ReferenceOffset]: {
        name: 'ReferenceOffset',
        path: '\\Segment\\Cluster\\BlockGroup\\ReferenceFrame\\ReferenceOffset',
        id: '0xC9',
        type: ElementType.Uinteger,
        minver: '0',
        maxver: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.ReferenceFrame,
            MatroskaElements.ReferenceOffset
        ]
    },
    [MatroskaElements.ReferenceTimestamp]: {
        name: 'ReferenceTimestamp',
        path: '\\Segment\\Cluster\\BlockGroup\\ReferenceFrame\\ReferenceTimestamp',
        id: '0xCA',
        type: ElementType.Uinteger,
        minver: '0',
        maxver: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cluster,
            MatroskaElements.BlockGroup,
            MatroskaElements.ReferenceFrame,
            MatroskaElements.ReferenceTimestamp
        ]
    },
    [MatroskaElements.EncryptedBlock]: {
        name: 'EncryptedBlock',
        path: '\\Segment\\Cluster\\EncryptedBlock',
        id: '0xAF',
        type: ElementType.Binary,
        minver: '0',
        maxver: '0',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Cluster, MatroskaElements.EncryptedBlock]
    },
    [MatroskaElements.Tracks]: {
        name: 'Tracks',
        path: '\\Segment\\Tracks',
        id: '0x1654AE6B',
        type: ElementType.Master,
        maxOccurs: '1',
        recurring: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Tracks]
    },
    [MatroskaElements.TrackEntry]: {
        name: 'TrackEntry',
        path: '\\Segment\\Tracks\\TrackEntry',
        id: '0xAE',
        type: ElementType.Master,
        minOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Tracks, MatroskaElements.TrackEntry]
    },
    [MatroskaElements.TrackNumber]: {
        name: 'TrackNumber',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackNumber',
        id: '0xD7',
        type: ElementType.Uinteger,
        range: 'not 0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrackNumber
        ]
    },
    [MatroskaElements.TrackUID]: {
        name: 'TrackUID',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackUID',
        id: '0x73C5',
        type: ElementType.Uinteger,
        range: 'not 0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrackUID
        ]
    },
    [MatroskaElements.TrackType]: {
        name: 'TrackType',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackType',
        id: '0x83',
        type: ElementType.Uinteger,
        range: 'not 0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrackType
        ]
    },
    [MatroskaElements.FlagEnabled]: {
        name: 'FlagEnabled',
        path: '\\Segment\\Tracks\\TrackEntry\\FlagEnabled',
        id: '0xB9',
        type: ElementType.Uinteger,
        minver: '2',
        range: '0-1',
        default: '1',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.FlagEnabled
        ]
    },
    [MatroskaElements.FlagDefault]: {
        name: 'FlagDefault',
        path: '\\Segment\\Tracks\\TrackEntry\\FlagDefault',
        id: '0x88',
        type: ElementType.Uinteger,
        range: '0-1',
        default: '1',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.FlagDefault
        ]
    },
    [MatroskaElements.FlagForced]: {
        name: 'FlagForced',
        path: '\\Segment\\Tracks\\TrackEntry\\FlagForced',
        id: '0x55AA',
        type: ElementType.Uinteger,
        range: '0-1',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.FlagForced
        ]
    },
    [MatroskaElements.FlagHearingImpaired]: {
        name: 'FlagHearingImpaired',
        path: '\\Segment\\Tracks\\TrackEntry\\FlagHearingImpaired',
        id: '0x55AB',
        type: ElementType.Uinteger,
        minver: '4',
        range: '0-1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.FlagHearingImpaired
        ]
    },
    [MatroskaElements.FlagVisualImpaired]: {
        name: 'FlagVisualImpaired',
        path: '\\Segment\\Tracks\\TrackEntry\\FlagVisualImpaired',
        id: '0x55AC',
        type: ElementType.Uinteger,
        minver: '4',
        range: '0-1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.FlagVisualImpaired
        ]
    },
    [MatroskaElements.FlagTextDescriptions]: {
        name: 'FlagTextDescriptions',
        path: '\\Segment\\Tracks\\TrackEntry\\FlagTextDescriptions',
        id: '0x55AD',
        type: ElementType.Uinteger,
        minver: '4',
        range: '0-1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.FlagTextDescriptions
        ]
    },
    [MatroskaElements.FlagOriginal]: {
        name: 'FlagOriginal',
        path: '\\Segment\\Tracks\\TrackEntry\\FlagOriginal',
        id: '0x55AE',
        type: ElementType.Uinteger,
        minver: '4',
        range: '0-1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.FlagOriginal
        ]
    },
    [MatroskaElements.FlagCommentary]: {
        name: 'FlagCommentary',
        path: '\\Segment\\Tracks\\TrackEntry\\FlagCommentary',
        id: '0x55AF',
        type: ElementType.Uinteger,
        minver: '4',
        range: '0-1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.FlagCommentary
        ]
    },
    [MatroskaElements.FlagLacing]: {
        name: 'FlagLacing',
        path: '\\Segment\\Tracks\\TrackEntry\\FlagLacing',
        id: '0x9C',
        type: ElementType.Uinteger,
        range: '0-1',
        default: '1',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.FlagLacing
        ]
    },
    [MatroskaElements.MinCache]: {
        name: 'MinCache',
        path: '\\Segment\\Tracks\\TrackEntry\\MinCache',
        id: '0x6DE7',
        type: ElementType.Uinteger,
        minver: '0',
        maxver: '0',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.MinCache
        ]
    },
    [MatroskaElements.MaxCache]: {
        name: 'MaxCache',
        path: '\\Segment\\Tracks\\TrackEntry\\MaxCache',
        id: '0x6DF8',
        type: ElementType.Uinteger,
        minver: '0',
        maxver: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.MaxCache
        ]
    },
    [MatroskaElements.DefaultDuration]: {
        name: 'DefaultDuration',
        path: '\\Segment\\Tracks\\TrackEntry\\DefaultDuration',
        id: '0x23E383',
        type: ElementType.Uinteger,
        range: 'not 0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.DefaultDuration
        ]
    },
    [MatroskaElements.DefaultDecodedFieldDuration]: {
        name: 'DefaultDecodedFieldDuration',
        path: '\\Segment\\Tracks\\TrackEntry\\DefaultDecodedFieldDuration',
        id: '0x234E7A',
        type: ElementType.Uinteger,
        minver: '4',
        range: 'not 0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.DefaultDecodedFieldDuration
        ]
    },
    [MatroskaElements.TrackTimestampScale]: {
        name: 'TrackTimestampScale',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackTimestampScale',
        id: '0x23314F',
        type: ElementType.Float,
        maxver: '3',
        range: '> 0x0p+0',
        default: '0x1p+0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrackTimestampScale
        ]
    },
    [MatroskaElements.TrackOffset]: {
        name: 'TrackOffset',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackOffset',
        id: '0x537F',
        type: ElementType.Integer,
        minver: '0',
        maxver: '0',
        default: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrackOffset
        ]
    },
    [MatroskaElements.MaxBlockAdditionID]: {
        name: 'MaxBlockAdditionID',
        path: '\\Segment\\Tracks\\TrackEntry\\MaxBlockAdditionID',
        id: '0x55EE',
        type: ElementType.Uinteger,
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.MaxBlockAdditionID
        ]
    },
    [MatroskaElements.BlockAdditionMapping]: {
        name: 'BlockAdditionMapping',
        path: '\\Segment\\Tracks\\TrackEntry\\BlockAdditionMapping',
        id: '0x41E4',
        type: ElementType.Master,
        minver: '4',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.BlockAdditionMapping
        ]
    },
    [MatroskaElements.BlockAddIDValue]: {
        name: 'BlockAddIDValue',
        path: '\\Segment\\Tracks\\TrackEntry\\BlockAdditionMapping\\BlockAddIDValue',
        id: '0x41F0',
        type: ElementType.Uinteger,
        minver: '4',
        range: '>=2',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.BlockAdditionMapping,
            MatroskaElements.BlockAddIDValue
        ]
    },
    [MatroskaElements.BlockAddIDName]: {
        name: 'BlockAddIDName',
        path: '\\Segment\\Tracks\\TrackEntry\\BlockAdditionMapping\\BlockAddIDName',
        id: '0x41A4',
        type: ElementType.String,
        minver: '4',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.BlockAdditionMapping,
            MatroskaElements.BlockAddIDName
        ]
    },
    [MatroskaElements.BlockAddIDType]: {
        name: 'BlockAddIDType',
        path: '\\Segment\\Tracks\\TrackEntry\\BlockAdditionMapping\\BlockAddIDType',
        id: '0x41E7',
        type: ElementType.Uinteger,
        minver: '4',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.BlockAdditionMapping,
            MatroskaElements.BlockAddIDType
        ]
    },
    [MatroskaElements.BlockAddIDExtraData]: {
        name: 'BlockAddIDExtraData',
        path: '\\Segment\\Tracks\\TrackEntry\\BlockAdditionMapping\\BlockAddIDExtraData',
        id: '0x41ED',
        type: ElementType.Binary,
        minver: '4',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.BlockAdditionMapping,
            MatroskaElements.BlockAddIDExtraData
        ]
    },
    [MatroskaElements.Name]: {
        name: 'Name',
        path: '\\Segment\\Tracks\\TrackEntry\\Name',
        id: '0x536E',
        type: ElementType.UTF8,
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Name
        ]
    },
    [MatroskaElements.Language]: {
        name: 'Language',
        path: '\\Segment\\Tracks\\TrackEntry\\Language',
        id: '0x22B59C',
        type: ElementType.String,
        default: 'eng',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Language
        ]
    },
    [MatroskaElements.LanguageBCP47]: {
        name: 'LanguageBCP47',
        path: '\\Segment\\Tracks\\TrackEntry\\LanguageBCP47',
        id: '0x22B59D',
        type: ElementType.String,
        minver: '4',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.LanguageBCP47
        ]
    },
    [MatroskaElements.CodecID]: {
        name: 'CodecID',
        path: '\\Segment\\Tracks\\TrackEntry\\CodecID',
        id: '0x86',
        type: ElementType.String,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.CodecID
        ]
    },
    [MatroskaElements.CodecPrivate]: {
        name: 'CodecPrivate',
        path: '\\Segment\\Tracks\\TrackEntry\\CodecPrivate',
        id: '0x63A2',
        type: ElementType.Binary,
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.CodecPrivate
        ]
    },
    [MatroskaElements.CodecName]: {
        name: 'CodecName',
        path: '\\Segment\\Tracks\\TrackEntry\\CodecName',
        id: '0x258688',
        type: ElementType.UTF8,
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.CodecName
        ]
    },
    [MatroskaElements.AttachmentLink]: {
        name: 'AttachmentLink',
        path: '\\Segment\\Tracks\\TrackEntry\\AttachmentLink',
        id: '0x7446',
        type: ElementType.Uinteger,
        maxver: '3',
        range: 'not 0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.AttachmentLink
        ]
    },
    [MatroskaElements.CodecSettings]: {
        name: 'CodecSettings',
        path: '\\Segment\\Tracks\\TrackEntry\\CodecSettings',
        id: '0x3A9697',
        type: ElementType.UTF8,
        minver: '0',
        maxver: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.CodecSettings
        ]
    },
    [MatroskaElements.CodecInfoURL]: {
        name: 'CodecInfoURL',
        path: '\\Segment\\Tracks\\TrackEntry\\CodecInfoURL',
        id: '0x3B4040',
        type: ElementType.String,
        minver: '0',
        maxver: '0',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.CodecInfoURL
        ]
    },
    [MatroskaElements.CodecDownloadURL]: {
        name: 'CodecDownloadURL',
        path: '\\Segment\\Tracks\\TrackEntry\\CodecDownloadURL',
        id: '0x26B240',
        type: ElementType.String,
        minver: '0',
        maxver: '0',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.CodecDownloadURL
        ]
    },
    [MatroskaElements.CodecDecodeAll]: {
        name: 'CodecDecodeAll',
        path: '\\Segment\\Tracks\\TrackEntry\\CodecDecodeAll',
        id: '0xAA',
        type: ElementType.Uinteger,
        maxver: '0',
        range: '0-1',
        default: '1',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.CodecDecodeAll
        ]
    },
    [MatroskaElements.TrackOverlay]: {
        name: 'TrackOverlay',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackOverlay',
        id: '0x6FAB',
        type: ElementType.Uinteger,
        maxver: '0',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrackOverlay
        ]
    },
    [MatroskaElements.CodecDelay]: {
        name: 'CodecDelay',
        path: '\\Segment\\Tracks\\TrackEntry\\CodecDelay',
        id: '0x56AA',
        type: ElementType.Uinteger,
        minver: '4',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.CodecDelay
        ]
    },
    [MatroskaElements.SeekPreRoll]: {
        name: 'SeekPreRoll',
        path: '\\Segment\\Tracks\\TrackEntry\\SeekPreRoll',
        id: '0x56BB',
        type: ElementType.Uinteger,
        minver: '4',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.SeekPreRoll
        ]
    },
    [MatroskaElements.TrackTranslate]: {
        name: 'TrackTranslate',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackTranslate',
        id: '0x6624',
        type: ElementType.Master,
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrackTranslate
        ]
    },
    [MatroskaElements.TrackTranslateTrackID]: {
        name: 'TrackTranslateTrackID',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackTranslate\\TrackTranslateTrackID',
        id: '0x66A5',
        type: ElementType.Binary,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrackTranslate,
            MatroskaElements.TrackTranslateTrackID
        ]
    },
    [MatroskaElements.TrackTranslateCodec]: {
        name: 'TrackTranslateCodec',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackTranslate\\TrackTranslateCodec',
        id: '0x66BF',
        type: ElementType.Uinteger,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrackTranslate,
            MatroskaElements.TrackTranslateCodec
        ]
    },
    [MatroskaElements.TrackTranslateEditionUID]: {
        name: 'TrackTranslateEditionUID',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackTranslate\\TrackTranslateEditionUID',
        id: '0x66FC',
        type: ElementType.Uinteger,
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrackTranslate,
            MatroskaElements.TrackTranslateEditionUID
        ]
    },
    [MatroskaElements.Video]: {
        name: 'Video',
        path: '\\Segment\\Tracks\\TrackEntry\\Video',
        id: '0xE0',
        type: ElementType.Master,
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video
        ]
    },
    [MatroskaElements.FlagInterlaced]: {
        name: 'FlagInterlaced',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\FlagInterlaced',
        id: '0x9A',
        type: ElementType.Uinteger,
        minver: '2',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.FlagInterlaced
        ]
    },
    [MatroskaElements.FieldOrder]: {
        name: 'FieldOrder',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\FieldOrder',
        id: '0x9D',
        type: ElementType.Uinteger,
        minver: '4',
        default: '2',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.FieldOrder
        ]
    },
    [MatroskaElements.StereoMode]: {
        name: 'StereoMode',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\StereoMode',
        id: '0x53B8',
        type: ElementType.Uinteger,
        minver: '3',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.StereoMode
        ]
    },
    [MatroskaElements.AlphaMode]: {
        name: 'AlphaMode',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\AlphaMode',
        id: '0x53C0',
        type: ElementType.Uinteger,
        minver: '3',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.AlphaMode
        ]
    },
    [MatroskaElements.OldStereoMode]: {
        name: 'OldStereoMode',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\OldStereoMode',
        id: '0x53B9',
        type: ElementType.Uinteger,
        maxver: '2',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.OldStereoMode
        ]
    },
    [MatroskaElements.PixelWidth]: {
        name: 'PixelWidth',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\PixelWidth',
        id: '0xB0',
        type: ElementType.Uinteger,
        range: 'not 0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.PixelWidth
        ]
    },
    [MatroskaElements.PixelHeight]: {
        name: 'PixelHeight',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\PixelHeight',
        id: '0xBA',
        type: ElementType.Uinteger,
        range: 'not 0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.PixelHeight
        ]
    },
    [MatroskaElements.PixelCropBottom]: {
        name: 'PixelCropBottom',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\PixelCropBottom',
        id: '0x54AA',
        type: ElementType.Uinteger,
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.PixelCropBottom
        ]
    },
    [MatroskaElements.PixelCropTop]: {
        name: 'PixelCropTop',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\PixelCropTop',
        id: '0x54BB',
        type: ElementType.Uinteger,
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.PixelCropTop
        ]
    },
    [MatroskaElements.PixelCropLeft]: {
        name: 'PixelCropLeft',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\PixelCropLeft',
        id: '0x54CC',
        type: ElementType.Uinteger,
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.PixelCropLeft
        ]
    },
    [MatroskaElements.PixelCropRight]: {
        name: 'PixelCropRight',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\PixelCropRight',
        id: '0x54DD',
        type: ElementType.Uinteger,
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.PixelCropRight
        ]
    },
    [MatroskaElements.DisplayWidth]: {
        name: 'DisplayWidth',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\DisplayWidth',
        id: '0x54B0',
        type: ElementType.Uinteger,
        range: 'not 0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.DisplayWidth
        ]
    },
    [MatroskaElements.DisplayHeight]: {
        name: 'DisplayHeight',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\DisplayHeight',
        id: '0x54BA',
        type: ElementType.Uinteger,
        range: 'not 0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.DisplayHeight
        ]
    },
    [MatroskaElements.DisplayUnit]: {
        name: 'DisplayUnit',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\DisplayUnit',
        id: '0x54B2',
        type: ElementType.Uinteger,
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.DisplayUnit
        ]
    },
    [MatroskaElements.AspectRatioType]: {
        name: 'AspectRatioType',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\AspectRatioType',
        id: '0x54B3',
        type: ElementType.Uinteger,
        minver: '0',
        maxver: '0',
        default: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.AspectRatioType
        ]
    },
    [MatroskaElements.UncompressedFourCC]: {
        name: 'UncompressedFourCC',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\UncompressedFourCC',
        id: '0x2EB524',
        type: ElementType.Binary,
        length: '4',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.UncompressedFourCC
        ]
    },
    [MatroskaElements.GammaValue]: {
        name: 'GammaValue',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\GammaValue',
        id: '0x2FB523',
        type: ElementType.Float,
        minver: '0',
        maxver: '0',
        range: '> 0x0p+0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.GammaValue
        ]
    },
    [MatroskaElements.FrameRate]: {
        name: 'FrameRate',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\FrameRate',
        id: '0x2383E3',
        type: ElementType.Float,
        minver: '0',
        maxver: '0',
        range: '> 0x0p+0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.FrameRate
        ]
    },
    [MatroskaElements.Colour]: {
        name: 'Colour',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour',
        id: '0x55B0',
        type: ElementType.Master,
        minver: '4',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour
        ]
    },
    [MatroskaElements.MatrixCoefficients]: {
        name: 'MatrixCoefficients',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MatrixCoefficients',
        id: '0x55B1',
        type: ElementType.Uinteger,
        minver: '4',
        default: '2',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.MatrixCoefficients
        ]
    },
    [MatroskaElements.BitsPerChannel]: {
        name: 'BitsPerChannel',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\BitsPerChannel',
        id: '0x55B2',
        type: ElementType.Uinteger,
        minver: '4',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.BitsPerChannel
        ]
    },
    [MatroskaElements.ChromaSubsamplingHorz]: {
        name: 'ChromaSubsamplingHorz',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\ChromaSubsamplingHorz',
        id: '0x55B3',
        type: ElementType.Uinteger,
        minver: '4',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.ChromaSubsamplingHorz
        ]
    },
    [MatroskaElements.ChromaSubsamplingVert]: {
        name: 'ChromaSubsamplingVert',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\ChromaSubsamplingVert',
        id: '0x55B4',
        type: ElementType.Uinteger,
        minver: '4',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.ChromaSubsamplingVert
        ]
    },
    [MatroskaElements.CbSubsamplingHorz]: {
        name: 'CbSubsamplingHorz',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\CbSubsamplingHorz',
        id: '0x55B5',
        type: ElementType.Uinteger,
        minver: '4',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.CbSubsamplingHorz
        ]
    },
    [MatroskaElements.CbSubsamplingVert]: {
        name: 'CbSubsamplingVert',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\CbSubsamplingVert',
        id: '0x55B6',
        type: ElementType.Uinteger,
        minver: '4',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.CbSubsamplingVert
        ]
    },
    [MatroskaElements.ChromaSitingHorz]: {
        name: 'ChromaSitingHorz',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\ChromaSitingHorz',
        id: '0x55B7',
        type: ElementType.Uinteger,
        minver: '4',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.ChromaSitingHorz
        ]
    },
    [MatroskaElements.ChromaSitingVert]: {
        name: 'ChromaSitingVert',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\ChromaSitingVert',
        id: '0x55B8',
        type: ElementType.Uinteger,
        minver: '4',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.ChromaSitingVert
        ]
    },
    [MatroskaElements.Range]: {
        name: 'Range',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\Range',
        id: '0x55B9',
        type: ElementType.Uinteger,
        minver: '4',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.Range
        ]
    },
    [MatroskaElements.TransferCharacteristics]: {
        name: 'TransferCharacteristics',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\TransferCharacteristics',
        id: '0x55BA',
        type: ElementType.Uinteger,
        minver: '4',
        default: '2',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.TransferCharacteristics
        ]
    },
    [MatroskaElements.Primaries]: {
        name: 'Primaries',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\Primaries',
        id: '0x55BB',
        type: ElementType.Uinteger,
        minver: '4',
        default: '2',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.Primaries
        ]
    },
    [MatroskaElements.MaxCLL]: {
        name: 'MaxCLL',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MaxCLL',
        id: '0x55BC',
        type: ElementType.Uinteger,
        minver: '4',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.MaxCLL
        ]
    },
    [MatroskaElements.MaxFALL]: {
        name: 'MaxFALL',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MaxFALL',
        id: '0x55BD',
        type: ElementType.Uinteger,
        minver: '4',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.MaxFALL
        ]
    },
    [MatroskaElements.MasteringMetadata]: {
        name: 'MasteringMetadata',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata',
        id: '0x55D0',
        type: ElementType.Master,
        minver: '4',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.MasteringMetadata
        ]
    },
    [MatroskaElements.PrimaryRChromaticityX]: {
        name: 'PrimaryRChromaticityX',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata\\PrimaryRChromaticityX',
        id: '0x55D1',
        type: ElementType.Float,
        minver: '4',
        range: '0x0p+0-0x1p+0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.MasteringMetadata,
            MatroskaElements.PrimaryRChromaticityX
        ]
    },
    [MatroskaElements.PrimaryRChromaticityY]: {
        name: 'PrimaryRChromaticityY',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata\\PrimaryRChromaticityY',
        id: '0x55D2',
        type: ElementType.Float,
        minver: '4',
        range: '0x0p+0-0x1p+0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.MasteringMetadata,
            MatroskaElements.PrimaryRChromaticityY
        ]
    },
    [MatroskaElements.PrimaryGChromaticityX]: {
        name: 'PrimaryGChromaticityX',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata\\PrimaryGChromaticityX',
        id: '0x55D3',
        type: ElementType.Float,
        minver: '4',
        range: '0x0p+0-0x1p+0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.MasteringMetadata,
            MatroskaElements.PrimaryGChromaticityX
        ]
    },
    [MatroskaElements.PrimaryGChromaticityY]: {
        name: 'PrimaryGChromaticityY',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata\\PrimaryGChromaticityY',
        id: '0x55D4',
        type: ElementType.Float,
        minver: '4',
        range: '0x0p+0-0x1p+0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.MasteringMetadata,
            MatroskaElements.PrimaryGChromaticityY
        ]
    },
    [MatroskaElements.PrimaryBChromaticityX]: {
        name: 'PrimaryBChromaticityX',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata\\PrimaryBChromaticityX',
        id: '0x55D5',
        type: ElementType.Float,
        minver: '4',
        range: '0x0p+0-0x1p+0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.MasteringMetadata,
            MatroskaElements.PrimaryBChromaticityX
        ]
    },
    [MatroskaElements.PrimaryBChromaticityY]: {
        name: 'PrimaryBChromaticityY',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata\\PrimaryBChromaticityY',
        id: '0x55D6',
        type: ElementType.Float,
        minver: '4',
        range: '0x0p+0-0x1p+0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.MasteringMetadata,
            MatroskaElements.PrimaryBChromaticityY
        ]
    },
    [MatroskaElements.WhitePointChromaticityX]: {
        name: 'WhitePointChromaticityX',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata\\WhitePointChromaticityX',
        id: '0x55D7',
        type: ElementType.Float,
        minver: '4',
        range: '0x0p+0-0x1p+0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.MasteringMetadata,
            MatroskaElements.WhitePointChromaticityX
        ]
    },
    [MatroskaElements.WhitePointChromaticityY]: {
        name: 'WhitePointChromaticityY',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata\\WhitePointChromaticityY',
        id: '0x55D8',
        type: ElementType.Float,
        minver: '4',
        range: '0x0p+0-0x1p+0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.MasteringMetadata,
            MatroskaElements.WhitePointChromaticityY
        ]
    },
    [MatroskaElements.LuminanceMax]: {
        name: 'LuminanceMax',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata\\LuminanceMax',
        id: '0x55D9',
        type: ElementType.Float,
        minver: '4',
        range: '>= 0x0p+0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.MasteringMetadata,
            MatroskaElements.LuminanceMax
        ]
    },
    [MatroskaElements.LuminanceMin]: {
        name: 'LuminanceMin',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Colour\\MasteringMetadata\\LuminanceMin',
        id: '0x55DA',
        type: ElementType.Float,
        minver: '4',
        range: '>= 0x0p+0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Colour,
            MatroskaElements.MasteringMetadata,
            MatroskaElements.LuminanceMin
        ]
    },
    [MatroskaElements.Projection]: {
        name: 'Projection',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Projection',
        id: '0x7670',
        type: ElementType.Master,
        minver: '4',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Projection
        ]
    },
    [MatroskaElements.ProjectionType]: {
        name: 'ProjectionType',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Projection\\ProjectionType',
        id: '0x7671',
        type: ElementType.Uinteger,
        minver: '4',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Projection,
            MatroskaElements.ProjectionType
        ]
    },
    [MatroskaElements.ProjectionPrivate]: {
        name: 'ProjectionPrivate',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Projection\\ProjectionPrivate',
        id: '0x7672',
        type: ElementType.Binary,
        minver: '4',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Projection,
            MatroskaElements.ProjectionPrivate
        ]
    },
    [MatroskaElements.ProjectionPoseYaw]: {
        name: 'ProjectionPoseYaw',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Projection\\ProjectionPoseYaw',
        id: '0x7673',
        type: ElementType.Float,
        minver: '4',
        range: '>= -0xB4p+0, <= 0xB4p+0',
        default: '0x0p+0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Projection,
            MatroskaElements.ProjectionPoseYaw
        ]
    },
    [MatroskaElements.ProjectionPosePitch]: {
        name: 'ProjectionPosePitch',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Projection\\ProjectionPosePitch',
        id: '0x7674',
        type: ElementType.Float,
        minver: '4',
        range: '>= -0x5Ap+0, <= 0x5Ap+0',
        default: '0x0p+0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Projection,
            MatroskaElements.ProjectionPosePitch
        ]
    },
    [MatroskaElements.ProjectionPoseRoll]: {
        name: 'ProjectionPoseRoll',
        path: '\\Segment\\Tracks\\TrackEntry\\Video\\Projection\\ProjectionPoseRoll',
        id: '0x7675',
        type: ElementType.Float,
        minver: '4',
        range: '>= -0xB4p+0, <= 0xB4p+0',
        default: '0x0p+0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Video,
            MatroskaElements.Projection,
            MatroskaElements.ProjectionPoseRoll
        ]
    },
    [MatroskaElements.Audio]: {
        name: 'Audio',
        path: '\\Segment\\Tracks\\TrackEntry\\Audio',
        id: '0xE1',
        type: ElementType.Master,
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Audio
        ]
    },
    [MatroskaElements.SamplingFrequency]: {
        name: 'SamplingFrequency',
        path: '\\Segment\\Tracks\\TrackEntry\\Audio\\SamplingFrequency',
        id: '0xB5',
        type: ElementType.Float,
        range: '> 0x0p+0',
        default: '0x1.f4p+12',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Audio,
            MatroskaElements.SamplingFrequency
        ]
    },
    [MatroskaElements.OutputSamplingFrequency]: {
        name: 'OutputSamplingFrequency',
        path: '\\Segment\\Tracks\\TrackEntry\\Audio\\OutputSamplingFrequency',
        id: '0x78B5',
        type: ElementType.Float,
        range: '> 0x0p+0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Audio,
            MatroskaElements.OutputSamplingFrequency
        ]
    },
    [MatroskaElements.Channels]: {
        name: 'Channels',
        path: '\\Segment\\Tracks\\TrackEntry\\Audio\\Channels',
        id: '0x9F',
        type: ElementType.Uinteger,
        range: 'not 0',
        default: '1',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Audio,
            MatroskaElements.Channels
        ]
    },
    [MatroskaElements.ChannelPositions]: {
        name: 'ChannelPositions',
        path: '\\Segment\\Tracks\\TrackEntry\\Audio\\ChannelPositions',
        id: '0x7D7B',
        type: ElementType.Binary,
        minver: '0',
        maxver: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Audio,
            MatroskaElements.ChannelPositions
        ]
    },
    [MatroskaElements.BitDepth]: {
        name: 'BitDepth',
        path: '\\Segment\\Tracks\\TrackEntry\\Audio\\BitDepth',
        id: '0x6264',
        type: ElementType.Uinteger,
        range: 'not 0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Audio,
            MatroskaElements.BitDepth
        ]
    },
    [MatroskaElements.Emphasis]: {
        name: 'Emphasis',
        path: '\\Segment\\Tracks\\TrackEntry\\Audio\\Emphasis',
        id: '0x52F1',
        type: ElementType.Uinteger,
        minver: '5',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.Audio,
            MatroskaElements.Emphasis
        ]
    },
    [MatroskaElements.TrackOperation]: {
        name: 'TrackOperation',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackOperation',
        id: '0xE2',
        type: ElementType.Master,
        minver: '3',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrackOperation
        ]
    },
    [MatroskaElements.TrackCombinePlanes]: {
        name: 'TrackCombinePlanes',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackOperation\\TrackCombinePlanes',
        id: '0xE3',
        type: ElementType.Master,
        minver: '3',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrackOperation,
            MatroskaElements.TrackCombinePlanes
        ]
    },
    [MatroskaElements.TrackPlane]: {
        name: 'TrackPlane',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackOperation\\TrackCombinePlanes\\TrackPlane',
        id: '0xE4',
        type: ElementType.Master,
        minver: '3',
        minOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrackOperation,
            MatroskaElements.TrackCombinePlanes,
            MatroskaElements.TrackPlane
        ]
    },
    [MatroskaElements.TrackPlaneUID]: {
        name: 'TrackPlaneUID',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackOperation\\TrackCombinePlanes\\TrackPlane\\TrackPlaneUID',
        id: '0xE5',
        type: ElementType.Uinteger,
        minver: '3',
        range: 'not 0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrackOperation,
            MatroskaElements.TrackCombinePlanes,
            MatroskaElements.TrackPlane,
            MatroskaElements.TrackPlaneUID
        ]
    },
    [MatroskaElements.TrackPlaneType]: {
        name: 'TrackPlaneType',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackOperation\\TrackCombinePlanes\\TrackPlane\\TrackPlaneType',
        id: '0xE6',
        type: ElementType.Uinteger,
        minver: '3',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrackOperation,
            MatroskaElements.TrackCombinePlanes,
            MatroskaElements.TrackPlane,
            MatroskaElements.TrackPlaneType
        ]
    },
    [MatroskaElements.TrackJoinBlocks]: {
        name: 'TrackJoinBlocks',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackOperation\\TrackJoinBlocks',
        id: '0xE9',
        type: ElementType.Master,
        minver: '3',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrackOperation,
            MatroskaElements.TrackJoinBlocks
        ]
    },
    [MatroskaElements.TrackJoinUID]: {
        name: 'TrackJoinUID',
        path: '\\Segment\\Tracks\\TrackEntry\\TrackOperation\\TrackJoinBlocks\\TrackJoinUID',
        id: '0xED',
        type: ElementType.Uinteger,
        minver: '3',
        range: 'not 0',
        minOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrackOperation,
            MatroskaElements.TrackJoinBlocks,
            MatroskaElements.TrackJoinUID
        ]
    },
    [MatroskaElements.TrickTrackUID]: {
        name: 'TrickTrackUID',
        path: '\\Segment\\Tracks\\TrackEntry\\TrickTrackUID',
        id: '0xC0',
        type: ElementType.Uinteger,
        minver: '0',
        maxver: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrickTrackUID
        ]
    },
    [MatroskaElements.TrickTrackSegmentUID]: {
        name: 'TrickTrackSegmentUID',
        path: '\\Segment\\Tracks\\TrackEntry\\TrickTrackSegmentUID',
        id: '0xC1',
        type: ElementType.Binary,
        minver: '0',
        maxver: '0',
        length: '16',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrickTrackSegmentUID
        ]
    },
    [MatroskaElements.TrickTrackFlag]: {
        name: 'TrickTrackFlag',
        path: '\\Segment\\Tracks\\TrackEntry\\TrickTrackFlag',
        id: '0xC6',
        type: ElementType.Uinteger,
        minver: '0',
        maxver: '0',
        default: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrickTrackFlag
        ]
    },
    [MatroskaElements.TrickMasterTrackUID]: {
        name: 'TrickMasterTrackUID',
        path: '\\Segment\\Tracks\\TrackEntry\\TrickMasterTrackUID',
        id: '0xC7',
        type: ElementType.Uinteger,
        minver: '0',
        maxver: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrickMasterTrackUID
        ]
    },
    [MatroskaElements.TrickMasterTrackSegmentUID]: {
        name: 'TrickMasterTrackSegmentUID',
        path: '\\Segment\\Tracks\\TrackEntry\\TrickMasterTrackSegmentUID',
        id: '0xC4',
        type: ElementType.Binary,
        minver: '0',
        maxver: '0',
        length: '16',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.TrickMasterTrackSegmentUID
        ]
    },
    [MatroskaElements.ContentEncodings]: {
        name: 'ContentEncodings',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings',
        id: '0x6D80',
        type: ElementType.Master,
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.ContentEncodings
        ]
    },
    [MatroskaElements.ContentEncoding]: {
        name: 'ContentEncoding',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding',
        id: '0x6240',
        type: ElementType.Master,
        minOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.ContentEncodings,
            MatroskaElements.ContentEncoding
        ]
    },
    [MatroskaElements.ContentEncodingOrder]: {
        name: 'ContentEncodingOrder',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncodingOrder',
        id: '0x5031',
        type: ElementType.Uinteger,
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.ContentEncodings,
            MatroskaElements.ContentEncoding,
            MatroskaElements.ContentEncodingOrder
        ]
    },
    [MatroskaElements.ContentEncodingScope]: {
        name: 'ContentEncodingScope',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncodingScope',
        id: '0x5032',
        type: ElementType.Uinteger,
        range: 'not 0',
        default: '1',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.ContentEncodings,
            MatroskaElements.ContentEncoding,
            MatroskaElements.ContentEncodingScope
        ]
    },
    [MatroskaElements.ContentEncodingType]: {
        name: 'ContentEncodingType',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncodingType',
        id: '0x5033',
        type: ElementType.Uinteger,
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.ContentEncodings,
            MatroskaElements.ContentEncoding,
            MatroskaElements.ContentEncodingType
        ]
    },
    [MatroskaElements.ContentCompression]: {
        name: 'ContentCompression',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentCompression',
        id: '0x5034',
        type: ElementType.Master,
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.ContentEncodings,
            MatroskaElements.ContentEncoding,
            MatroskaElements.ContentCompression
        ]
    },
    [MatroskaElements.ContentCompAlgo]: {
        name: 'ContentCompAlgo',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentCompression\\ContentCompAlgo',
        id: '0x4254',
        type: ElementType.Uinteger,
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.ContentEncodings,
            MatroskaElements.ContentEncoding,
            MatroskaElements.ContentCompression,
            MatroskaElements.ContentCompAlgo
        ]
    },
    [MatroskaElements.ContentCompSettings]: {
        name: 'ContentCompSettings',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentCompression\\ContentCompSettings',
        id: '0x4255',
        type: ElementType.Binary,
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.ContentEncodings,
            MatroskaElements.ContentEncoding,
            MatroskaElements.ContentCompression,
            MatroskaElements.ContentCompSettings
        ]
    },
    [MatroskaElements.ContentEncryption]: {
        name: 'ContentEncryption',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncryption',
        id: '0x5035',
        type: ElementType.Master,
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.ContentEncodings,
            MatroskaElements.ContentEncoding,
            MatroskaElements.ContentEncryption
        ]
    },
    [MatroskaElements.ContentEncAlgo]: {
        name: 'ContentEncAlgo',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncryption\\ContentEncAlgo',
        id: '0x47E1',
        type: ElementType.Uinteger,
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.ContentEncodings,
            MatroskaElements.ContentEncoding,
            MatroskaElements.ContentEncryption,
            MatroskaElements.ContentEncAlgo
        ]
    },
    [MatroskaElements.ContentEncKeyID]: {
        name: 'ContentEncKeyID',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncryption\\ContentEncKeyID',
        id: '0x47E2',
        type: ElementType.Binary,
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.ContentEncodings,
            MatroskaElements.ContentEncoding,
            MatroskaElements.ContentEncryption,
            MatroskaElements.ContentEncKeyID
        ]
    },
    [MatroskaElements.ContentEncAESSettings]: {
        name: 'ContentEncAESSettings',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncryption\\ContentEncAESSettings',
        id: '0x47E7',
        type: ElementType.Master,
        minver: '4',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.ContentEncodings,
            MatroskaElements.ContentEncoding,
            MatroskaElements.ContentEncryption,
            MatroskaElements.ContentEncAESSettings
        ]
    },
    [MatroskaElements.AESSettingsCipherMode]: {
        name: 'AESSettingsCipherMode',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncryption\\ContentEncAESSettings\\AESSettingsCipherMode',
        id: '0x47E8',
        type: ElementType.Uinteger,
        minver: '4',
        range: 'not 0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.ContentEncodings,
            MatroskaElements.ContentEncoding,
            MatroskaElements.ContentEncryption,
            MatroskaElements.ContentEncAESSettings,
            MatroskaElements.AESSettingsCipherMode
        ]
    },
    [MatroskaElements.ContentSignature]: {
        name: 'ContentSignature',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncryption\\ContentSignature',
        id: '0x47E3',
        type: ElementType.Binary,
        maxver: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.ContentEncodings,
            MatroskaElements.ContentEncoding,
            MatroskaElements.ContentEncryption,
            MatroskaElements.ContentSignature
        ]
    },
    [MatroskaElements.ContentSigKeyID]: {
        name: 'ContentSigKeyID',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncryption\\ContentSigKeyID',
        id: '0x47E4',
        type: ElementType.Binary,
        maxver: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.ContentEncodings,
            MatroskaElements.ContentEncoding,
            MatroskaElements.ContentEncryption,
            MatroskaElements.ContentSigKeyID
        ]
    },
    [MatroskaElements.ContentSigAlgo]: {
        name: 'ContentSigAlgo',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncryption\\ContentSigAlgo',
        id: '0x47E5',
        type: ElementType.Uinteger,
        maxver: '0',
        default: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.ContentEncodings,
            MatroskaElements.ContentEncoding,
            MatroskaElements.ContentEncryption,
            MatroskaElements.ContentSigAlgo
        ]
    },
    [MatroskaElements.ContentSigHashAlgo]: {
        name: 'ContentSigHashAlgo',
        path: '\\Segment\\Tracks\\TrackEntry\\ContentEncodings\\ContentEncoding\\ContentEncryption\\ContentSigHashAlgo',
        id: '0x47E6',
        type: ElementType.Uinteger,
        maxver: '0',
        default: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tracks,
            MatroskaElements.TrackEntry,
            MatroskaElements.ContentEncodings,
            MatroskaElements.ContentEncoding,
            MatroskaElements.ContentEncryption,
            MatroskaElements.ContentSigHashAlgo
        ]
    },
    [MatroskaElements.Cues]: {
        name: 'Cues',
        path: '\\Segment\\Cues',
        id: '0x1C53BB6B',
        type: ElementType.Master,
        maxOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Cues]
    },
    [MatroskaElements.CuePoint]: {
        name: 'CuePoint',
        path: '\\Segment\\Cues\\CuePoint',
        id: '0xBB',
        type: ElementType.Master,
        minOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Cues, MatroskaElements.CuePoint]
    },
    [MatroskaElements.CueTime]: {
        name: 'CueTime',
        path: '\\Segment\\Cues\\CuePoint\\CueTime',
        id: '0xB3',
        type: ElementType.Uinteger,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cues,
            MatroskaElements.CuePoint,
            MatroskaElements.CueTime
        ]
    },
    [MatroskaElements.CueTrackPositions]: {
        name: 'CueTrackPositions',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions',
        id: '0xB7',
        type: ElementType.Master,
        minOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cues,
            MatroskaElements.CuePoint,
            MatroskaElements.CueTrackPositions
        ]
    },
    [MatroskaElements.CueTrack]: {
        name: 'CueTrack',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueTrack',
        id: '0xF7',
        type: ElementType.Uinteger,
        range: 'not 0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cues,
            MatroskaElements.CuePoint,
            MatroskaElements.CueTrackPositions,
            MatroskaElements.CueTrack
        ]
    },
    [MatroskaElements.CueClusterPosition]: {
        name: 'CueClusterPosition',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueClusterPosition',
        id: '0xF1',
        type: ElementType.Uinteger,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cues,
            MatroskaElements.CuePoint,
            MatroskaElements.CueTrackPositions,
            MatroskaElements.CueClusterPosition
        ]
    },
    [MatroskaElements.CueRelativePosition]: {
        name: 'CueRelativePosition',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueRelativePosition',
        id: '0xF0',
        type: ElementType.Uinteger,
        minver: '4',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cues,
            MatroskaElements.CuePoint,
            MatroskaElements.CueTrackPositions,
            MatroskaElements.CueRelativePosition
        ]
    },
    [MatroskaElements.CueDuration]: {
        name: 'CueDuration',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueDuration',
        id: '0xB2',
        type: ElementType.Uinteger,
        minver: '4',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cues,
            MatroskaElements.CuePoint,
            MatroskaElements.CueTrackPositions,
            MatroskaElements.CueDuration
        ]
    },
    [MatroskaElements.CueBlockNumber]: {
        name: 'CueBlockNumber',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueBlockNumber',
        id: '0x5378',
        type: ElementType.Uinteger,
        range: 'not 0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cues,
            MatroskaElements.CuePoint,
            MatroskaElements.CueTrackPositions,
            MatroskaElements.CueBlockNumber
        ]
    },
    [MatroskaElements.CueCodecState]: {
        name: 'CueCodecState',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueCodecState',
        id: '0xEA',
        type: ElementType.Uinteger,
        minver: '2',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cues,
            MatroskaElements.CuePoint,
            MatroskaElements.CueTrackPositions,
            MatroskaElements.CueCodecState
        ]
    },
    [MatroskaElements.CueReference]: {
        name: 'CueReference',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueReference',
        id: '0xDB',
        type: ElementType.Master,
        minver: '2',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cues,
            MatroskaElements.CuePoint,
            MatroskaElements.CueTrackPositions,
            MatroskaElements.CueReference
        ]
    },
    [MatroskaElements.CueRefTime]: {
        name: 'CueRefTime',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueReference\\CueRefTime',
        id: '0x96',
        type: ElementType.Uinteger,
        minver: '2',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cues,
            MatroskaElements.CuePoint,
            MatroskaElements.CueTrackPositions,
            MatroskaElements.CueReference,
            MatroskaElements.CueRefTime
        ]
    },
    [MatroskaElements.CueRefCluster]: {
        name: 'CueRefCluster',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueReference\\CueRefCluster',
        id: '0x97',
        type: ElementType.Uinteger,
        minver: '0',
        maxver: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cues,
            MatroskaElements.CuePoint,
            MatroskaElements.CueTrackPositions,
            MatroskaElements.CueReference,
            MatroskaElements.CueRefCluster
        ]
    },
    [MatroskaElements.CueRefNumber]: {
        name: 'CueRefNumber',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueReference\\CueRefNumber',
        id: '0x535F',
        type: ElementType.Uinteger,
        minver: '0',
        maxver: '0',
        range: 'not 0',
        default: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cues,
            MatroskaElements.CuePoint,
            MatroskaElements.CueTrackPositions,
            MatroskaElements.CueReference,
            MatroskaElements.CueRefNumber
        ]
    },
    [MatroskaElements.CueRefCodecState]: {
        name: 'CueRefCodecState',
        path: '\\Segment\\Cues\\CuePoint\\CueTrackPositions\\CueReference\\CueRefCodecState',
        id: '0xEB',
        type: ElementType.Uinteger,
        minver: '0',
        maxver: '0',
        default: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Cues,
            MatroskaElements.CuePoint,
            MatroskaElements.CueTrackPositions,
            MatroskaElements.CueReference,
            MatroskaElements.CueRefCodecState
        ]
    },
    [MatroskaElements.Attachments]: {
        name: 'Attachments',
        path: '\\Segment\\Attachments',
        id: '0x1941A469',
        type: ElementType.Master,
        maxOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Attachments]
    },
    [MatroskaElements.AttachedFile]: {
        name: 'AttachedFile',
        path: '\\Segment\\Attachments\\AttachedFile',
        id: '0x61A7',
        type: ElementType.Master,
        minOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Attachments, MatroskaElements.AttachedFile]
    },
    [MatroskaElements.FileDescription]: {
        name: 'FileDescription',
        path: '\\Segment\\Attachments\\AttachedFile\\FileDescription',
        id: '0x467E',
        type: ElementType.UTF8,
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Attachments,
            MatroskaElements.AttachedFile,
            MatroskaElements.FileDescription
        ]
    },
    [MatroskaElements.FileName]: {
        name: 'FileName',
        path: '\\Segment\\Attachments\\AttachedFile\\FileName',
        id: '0x466E',
        type: ElementType.UTF8,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Attachments,
            MatroskaElements.AttachedFile,
            MatroskaElements.FileName
        ]
    },
    [MatroskaElements.FileMediaType]: {
        name: 'FileMediaType',
        path: '\\Segment\\Attachments\\AttachedFile\\FileMediaType',
        id: '0x4660',
        type: ElementType.String,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Attachments,
            MatroskaElements.AttachedFile,
            MatroskaElements.FileMediaType
        ]
    },
    [MatroskaElements.FileData]: {
        name: 'FileData',
        path: '\\Segment\\Attachments\\AttachedFile\\FileData',
        id: '0x465C',
        type: ElementType.Binary,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Attachments,
            MatroskaElements.AttachedFile,
            MatroskaElements.FileData
        ]
    },
    [MatroskaElements.FileUID]: {
        name: 'FileUID',
        path: '\\Segment\\Attachments\\AttachedFile\\FileUID',
        id: '0x46AE',
        type: ElementType.Uinteger,
        range: 'not 0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Attachments,
            MatroskaElements.AttachedFile,
            MatroskaElements.FileUID
        ]
    },
    [MatroskaElements.FileReferral]: {
        name: 'FileReferral',
        path: '\\Segment\\Attachments\\AttachedFile\\FileReferral',
        id: '0x4675',
        type: ElementType.Binary,
        minver: '0',
        maxver: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Attachments,
            MatroskaElements.AttachedFile,
            MatroskaElements.FileReferral
        ]
    },
    [MatroskaElements.FileUsedStartTime]: {
        name: 'FileUsedStartTime',
        path: '\\Segment\\Attachments\\AttachedFile\\FileUsedStartTime',
        id: '0x4661',
        type: ElementType.Uinteger,
        minver: '0',
        maxver: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Attachments,
            MatroskaElements.AttachedFile,
            MatroskaElements.FileUsedStartTime
        ]
    },
    [MatroskaElements.FileUsedEndTime]: {
        name: 'FileUsedEndTime',
        path: '\\Segment\\Attachments\\AttachedFile\\FileUsedEndTime',
        id: '0x4662',
        type: ElementType.Uinteger,
        minver: '0',
        maxver: '0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Attachments,
            MatroskaElements.AttachedFile,
            MatroskaElements.FileUsedEndTime
        ]
    },
    [MatroskaElements.Chapters]: {
        name: 'Chapters',
        path: '\\Segment\\Chapters',
        id: '0x1043A770',
        type: ElementType.Master,
        maxOccurs: '1',
        recurring: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Chapters]
    },
    [MatroskaElements.EditionEntry]: {
        name: 'EditionEntry',
        path: '\\Segment\\Chapters\\EditionEntry',
        id: '0x45B9',
        type: ElementType.Master,
        minOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Chapters, MatroskaElements.EditionEntry]
    },
    [MatroskaElements.EditionUID]: {
        name: 'EditionUID',
        path: '\\Segment\\Chapters\\EditionEntry\\EditionUID',
        id: '0x45BC',
        type: ElementType.Uinteger,
        range: 'not 0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.EditionUID
        ]
    },
    [MatroskaElements.EditionFlagHidden]: {
        name: 'EditionFlagHidden',
        path: '\\Segment\\Chapters\\EditionEntry\\EditionFlagHidden',
        id: '0x45BD',
        type: ElementType.Uinteger,
        range: '0-1',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.EditionFlagHidden
        ]
    },
    [MatroskaElements.EditionFlagDefault]: {
        name: 'EditionFlagDefault',
        path: '\\Segment\\Chapters\\EditionEntry\\EditionFlagDefault',
        id: '0x45DB',
        type: ElementType.Uinteger,
        range: '0-1',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.EditionFlagDefault
        ]
    },
    [MatroskaElements.EditionFlagOrdered]: {
        name: 'EditionFlagOrdered',
        path: '\\Segment\\Chapters\\EditionEntry\\EditionFlagOrdered',
        id: '0x45DD',
        type: ElementType.Uinteger,
        range: '0-1',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.EditionFlagOrdered
        ]
    },
    [MatroskaElements.EditionDisplay]: {
        name: 'EditionDisplay',
        path: '\\Segment\\Chapters\\EditionEntry\\EditionDisplay',
        id: '0x4520',
        type: ElementType.Master,
        minver: '5',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.EditionDisplay
        ]
    },
    [MatroskaElements.EditionString]: {
        name: 'EditionString',
        path: '\\Segment\\Chapters\\EditionEntry\\EditionDisplay\\EditionString',
        id: '0x4521',
        type: ElementType.UTF8,
        minver: '5',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.EditionDisplay,
            MatroskaElements.EditionString
        ]
    },
    [MatroskaElements.EditionLanguageIETF]: {
        name: 'EditionLanguageIETF',
        path: '\\Segment\\Chapters\\EditionEntry\\EditionDisplay\\EditionLanguageIETF',
        id: '0x45E4',
        type: ElementType.String,
        minver: '5',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.EditionDisplay,
            MatroskaElements.EditionLanguageIETF
        ]
    },
    [MatroskaElements.ChapterAtom]: {
        name: 'ChapterAtom',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom',
        id: '0xB6',
        type: ElementType.Master,
        minOccurs: '1',
        recursive: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom
        ]
    },
    [MatroskaElements.ChapterUID]: {
        name: 'ChapterUID',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterUID',
        id: '0x73C4',
        type: ElementType.Uinteger,
        range: 'not 0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapterUID
        ]
    },
    [MatroskaElements.ChapterStringUID]: {
        name: 'ChapterStringUID',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterStringUID',
        id: '0x5654',
        type: ElementType.UTF8,
        minver: '3',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapterStringUID
        ]
    },
    [MatroskaElements.ChapterTimeStart]: {
        name: 'ChapterTimeStart',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterTimeStart',
        id: '0x91',
        type: ElementType.Uinteger,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapterTimeStart
        ]
    },
    [MatroskaElements.ChapterTimeEnd]: {
        name: 'ChapterTimeEnd',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterTimeEnd',
        id: '0x92',
        type: ElementType.Uinteger,
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapterTimeEnd
        ]
    },
    [MatroskaElements.ChapterFlagHidden]: {
        name: 'ChapterFlagHidden',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterFlagHidden',
        id: '0x98',
        type: ElementType.Uinteger,
        range: '0-1',
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapterFlagHidden
        ]
    },
    [MatroskaElements.ChapterFlagEnabled]: {
        name: 'ChapterFlagEnabled',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterFlagEnabled',
        id: '0x4598',
        type: ElementType.Uinteger,
        range: '0-1',
        default: '1',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapterFlagEnabled
        ]
    },
    [MatroskaElements.ChapterSegmentUUID]: {
        name: 'ChapterSegmentUUID',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterSegmentUUID',
        id: '0x6E67',
        type: ElementType.Binary,
        length: '16',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapterSegmentUUID
        ]
    },
    [MatroskaElements.ChapterSkipType]: {
        name: 'ChapterSkipType',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterSkipType',
        id: '0x4588',
        type: ElementType.Uinteger,
        minver: '5',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapterSkipType
        ]
    },
    [MatroskaElements.ChapterSegmentEditionUID]: {
        name: 'ChapterSegmentEditionUID',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterSegmentEditionUID',
        id: '0x6EBC',
        type: ElementType.Uinteger,
        range: 'not 0',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapterSegmentEditionUID
        ]
    },
    [MatroskaElements.ChapterPhysicalEquiv]: {
        name: 'ChapterPhysicalEquiv',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterPhysicalEquiv',
        id: '0x63C3',
        type: ElementType.Uinteger,
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapterPhysicalEquiv
        ]
    },
    [MatroskaElements.ChapterTrack]: {
        name: 'ChapterTrack',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterTrack',
        id: '0x8F',
        type: ElementType.Master,
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapterTrack
        ]
    },
    [MatroskaElements.ChapterTrackUID]: {
        name: 'ChapterTrackUID',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterTrack\\ChapterTrackUID',
        id: '0x89',
        type: ElementType.Uinteger,
        range: 'not 0',
        minOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapterTrack,
            MatroskaElements.ChapterTrackUID
        ]
    },
    [MatroskaElements.ChapterDisplay]: {
        name: 'ChapterDisplay',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterDisplay',
        id: '0x80',
        type: ElementType.Master,
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapterDisplay
        ]
    },
    [MatroskaElements.ChapString]: {
        name: 'ChapString',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterDisplay\\ChapString',
        id: '0x85',
        type: ElementType.UTF8,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapterDisplay,
            MatroskaElements.ChapString
        ]
    },
    [MatroskaElements.ChapLanguage]: {
        name: 'ChapLanguage',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterDisplay\\ChapLanguage',
        id: '0x437C',
        type: ElementType.String,
        default: 'eng',
        minOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapterDisplay,
            MatroskaElements.ChapLanguage
        ]
    },
    [MatroskaElements.ChapLanguageBCP47]: {
        name: 'ChapLanguageBCP47',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterDisplay\\ChapLanguageBCP47',
        id: '0x437D',
        type: ElementType.String,
        minver: '4',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapterDisplay,
            MatroskaElements.ChapLanguageBCP47
        ]
    },
    [MatroskaElements.ChapCountry]: {
        name: 'ChapCountry',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapterDisplay\\ChapCountry',
        id: '0x437E',
        type: ElementType.String,
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapterDisplay,
            MatroskaElements.ChapCountry
        ]
    },
    [MatroskaElements.ChapProcess]: {
        name: 'ChapProcess',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapProcess',
        id: '0x6944',
        type: ElementType.Master,
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapProcess
        ]
    },
    [MatroskaElements.ChapProcessCodecID]: {
        name: 'ChapProcessCodecID',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapProcess\\ChapProcessCodecID',
        id: '0x6955',
        type: ElementType.Uinteger,
        default: '0',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapProcess,
            MatroskaElements.ChapProcessCodecID
        ]
    },
    [MatroskaElements.ChapProcessPrivate]: {
        name: 'ChapProcessPrivate',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapProcess\\ChapProcessPrivate',
        id: '0x450D',
        type: ElementType.Binary,
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapProcess,
            MatroskaElements.ChapProcessPrivate
        ]
    },
    [MatroskaElements.ChapProcessCommand]: {
        name: 'ChapProcessCommand',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapProcess\\ChapProcessCommand',
        id: '0x6911',
        type: ElementType.Master,
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapProcess,
            MatroskaElements.ChapProcessCommand
        ]
    },
    [MatroskaElements.ChapProcessTime]: {
        name: 'ChapProcessTime',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapProcess\\ChapProcessCommand\\ChapProcessTime',
        id: '0x6922',
        type: ElementType.Uinteger,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapProcess,
            MatroskaElements.ChapProcessCommand,
            MatroskaElements.ChapProcessTime
        ]
    },
    [MatroskaElements.ChapProcessData]: {
        name: 'ChapProcessData',
        path: '\\Segment\\Chapters\\EditionEntry\\+ChapterAtom\\ChapProcess\\ChapProcessCommand\\ChapProcessData',
        id: '0x6933',
        type: ElementType.Binary,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Chapters,
            MatroskaElements.EditionEntry,
            MatroskaElements.ChapterAtom,
            MatroskaElements.ChapProcess,
            MatroskaElements.ChapProcessCommand,
            MatroskaElements.ChapProcessData
        ]
    },
    [MatroskaElements.Tags]: {
        name: 'Tags',
        path: '\\Segment\\Tags',
        id: '0x1254C367',
        type: ElementType.Master,
        pathArray: [MatroskaElements.Segment, MatroskaElements.Tags]
    },
    [MatroskaElements.Tag]: {
        name: 'Tag',
        path: '\\Segment\\Tags\\Tag',
        id: '0x7373',
        type: ElementType.Master,
        minOccurs: '1',
        pathArray: [MatroskaElements.Segment, MatroskaElements.Tags, MatroskaElements.Tag]
    },
    [MatroskaElements.Targets]: {
        name: 'Targets',
        path: '\\Segment\\Tags\\Tag\\Targets',
        id: '0x63C0',
        type: ElementType.Master,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tags,
            MatroskaElements.Tag,
            MatroskaElements.Targets
        ]
    },
    [MatroskaElements.TargetTypeValue]: {
        name: 'TargetTypeValue',
        path: '\\Segment\\Tags\\Tag\\Targets\\TargetTypeValue',
        id: '0x68CA',
        type: ElementType.Uinteger,
        range: 'not 0',
        default: '50',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tags,
            MatroskaElements.Tag,
            MatroskaElements.Targets,
            MatroskaElements.TargetTypeValue
        ]
    },
    [MatroskaElements.TargetType]: {
        name: 'TargetType',
        path: '\\Segment\\Tags\\Tag\\Targets\\TargetType',
        id: '0x63CA',
        type: ElementType.String,
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tags,
            MatroskaElements.Tag,
            MatroskaElements.Targets,
            MatroskaElements.TargetType
        ]
    },
    [MatroskaElements.TagTrackUID]: {
        name: 'TagTrackUID',
        path: '\\Segment\\Tags\\Tag\\Targets\\TagTrackUID',
        id: '0x63C5',
        type: ElementType.Uinteger,
        default: '0',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tags,
            MatroskaElements.Tag,
            MatroskaElements.Targets,
            MatroskaElements.TagTrackUID
        ]
    },
    [MatroskaElements.TagEditionUID]: {
        name: 'TagEditionUID',
        path: '\\Segment\\Tags\\Tag\\Targets\\TagEditionUID',
        id: '0x63C9',
        type: ElementType.Uinteger,
        default: '0',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tags,
            MatroskaElements.Tag,
            MatroskaElements.Targets,
            MatroskaElements.TagEditionUID
        ]
    },
    [MatroskaElements.TagChapterUID]: {
        name: 'TagChapterUID',
        path: '\\Segment\\Tags\\Tag\\Targets\\TagChapterUID',
        id: '0x63C4',
        type: ElementType.Uinteger,
        default: '0',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tags,
            MatroskaElements.Tag,
            MatroskaElements.Targets,
            MatroskaElements.TagChapterUID
        ]
    },
    [MatroskaElements.TagAttachmentUID]: {
        name: 'TagAttachmentUID',
        path: '\\Segment\\Tags\\Tag\\Targets\\TagAttachmentUID',
        id: '0x63C6',
        type: ElementType.Uinteger,
        default: '0',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tags,
            MatroskaElements.Tag,
            MatroskaElements.Targets,
            MatroskaElements.TagAttachmentUID
        ]
    },
    [MatroskaElements.SimpleTag]: {
        name: 'SimpleTag',
        path: '\\Segment\\Tags\\Tag\\+SimpleTag',
        id: '0x67C8',
        type: ElementType.Master,
        minOccurs: '1',
        recursive: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tags,
            MatroskaElements.Tag,
            MatroskaElements.SimpleTag
        ]
    },
    [MatroskaElements.TagName]: {
        name: 'TagName',
        path: '\\Segment\\Tags\\Tag\\+SimpleTag\\TagName',
        id: '0x45A3',
        type: ElementType.UTF8,
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tags,
            MatroskaElements.Tag,
            MatroskaElements.SimpleTag,
            MatroskaElements.TagName
        ]
    },
    [MatroskaElements.TagLanguage]: {
        name: 'TagLanguage',
        path: '\\Segment\\Tags\\Tag\\+SimpleTag\\TagLanguage',
        id: '0x447A',
        type: ElementType.String,
        default: 'und',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tags,
            MatroskaElements.Tag,
            MatroskaElements.SimpleTag,
            MatroskaElements.TagLanguage
        ]
    },
    [MatroskaElements.TagLanguageBCP47]: {
        name: 'TagLanguageBCP47',
        path: '\\Segment\\Tags\\Tag\\+SimpleTag\\TagLanguageBCP47',
        id: '0x447B',
        type: ElementType.String,
        minver: '4',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tags,
            MatroskaElements.Tag,
            MatroskaElements.SimpleTag,
            MatroskaElements.TagLanguageBCP47
        ]
    },
    [MatroskaElements.TagDefault]: {
        name: 'TagDefault',
        path: '\\Segment\\Tags\\Tag\\+SimpleTag\\TagDefault',
        id: '0x4484',
        type: ElementType.Uinteger,
        range: '0-1',
        default: '1',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tags,
            MatroskaElements.Tag,
            MatroskaElements.SimpleTag,
            MatroskaElements.TagDefault
        ]
    },
    [MatroskaElements.TagDefaultBogus]: {
        name: 'TagDefaultBogus',
        path: '\\Segment\\Tags\\Tag\\+SimpleTag\\TagDefaultBogus',
        id: '0x44B4',
        type: ElementType.Uinteger,
        minver: '0',
        maxver: '0',
        range: '0-1',
        default: '1',
        minOccurs: '1',
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tags,
            MatroskaElements.Tag,
            MatroskaElements.SimpleTag,
            MatroskaElements.TagDefaultBogus
        ]
    },
    [MatroskaElements.TagString]: {
        name: 'TagString',
        path: '\\Segment\\Tags\\Tag\\+SimpleTag\\TagString',
        id: '0x4487',
        type: ElementType.UTF8,
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tags,
            MatroskaElements.Tag,
            MatroskaElements.SimpleTag,
            MatroskaElements.TagString
        ]
    },
    [MatroskaElements.TagBinary]: {
        name: 'TagBinary',
        path: '\\Segment\\Tags\\Tag\\+SimpleTag\\TagBinary',
        id: '0x4485',
        type: ElementType.Binary,
        maxOccurs: '1',
        pathArray: [
            MatroskaElements.Segment,
            MatroskaElements.Tags,
            MatroskaElements.Tag,
            MatroskaElements.SimpleTag,
            MatroskaElements.TagBinary
        ]
    }
};

export type ElementEventMap = {
    [EbmlElements.EBMLHead]: (data: Elements.EBMLHead) => void;
    [EbmlElements.EBMLVersion]: (data: Elements.EBMLVersion) => void;
    [EbmlElements.EBMLReadVersion]: (data: Elements.EBMLReadVersion) => void;
    [EbmlElements.EBMLMaxIDLength]: (data: Elements.EBMLMaxIDLength) => void;
    [EbmlElements.EBMLMaxSizeLength]: (data: Elements.EBMLMaxSizeLength) => void;
    [EbmlElements.DocType]: (data: Elements.DocType) => void;
    [EbmlElements.DocTypeVersion]: (data: Elements.DocTypeVersion) => void;
    [EbmlElements.DocTypeReadVersion]: (data: Elements.DocTypeReadVersion) => void;
    [EbmlElements.CRC32]: (data: Elements.CRC32) => void;
    // [EbmlElements.void]: (data: Elements.Void) => void, Void elements are skipped entirely
    [EbmlElements.SignatureSlot]: (data: Elements.SignatureSlot) => void;
    [EbmlElements.SignatureAlgo]: (data: Elements.SignatureAlgo) => void;
    [EbmlElements.SignatureHash]: (data: Elements.SignatureHash) => void;
    [EbmlElements.SignaturePublicKey]: (data: Elements.SignaturePublicKey) => void;
    [EbmlElements.Signature]: (data: Elements.Signature) => void;
    [EbmlElements.SignatureElements]: (data: Elements.SignatureElements) => void;
    [EbmlElements.SignatureElementList]: (data: Elements.SignatureElementList) => void;
    [EbmlElements.SignedElement]: (data: Elements.SignedElement) => void;
    [MatroskaElements.EBMLMaxIDLength]: (data: Elements.EBMLMaxIDLength) => void;
    [MatroskaElements.EBMLMaxSizeLength]: (data: Elements.EBMLMaxSizeLength) => void;
    [MatroskaElements.Segment]: (data: Elements.Segment) => void;
    [MatroskaElements.SeekHead]: (data: Elements.SeekHead) => void;
    [MatroskaElements.Seek]: (data: Elements.Seek) => void;
    [MatroskaElements.SeekID]: (data: Elements.SeekID) => void;
    [MatroskaElements.SeekPosition]: (data: Elements.SeekPosition) => void;
    [MatroskaElements.Info]: (data: Elements.Info) => void;
    [MatroskaElements.SegmentUUID]: (data: Elements.SegmentUUID) => void;
    [MatroskaElements.SegmentFilename]: (data: Elements.SegmentFilename) => void;
    [MatroskaElements.PrevUUID]: (data: Elements.PrevUUID) => void;
    [MatroskaElements.PrevFilename]: (data: Elements.PrevFilename) => void;
    [MatroskaElements.NextUUID]: (data: Elements.NextUUID) => void;
    [MatroskaElements.NextFilename]: (data: Elements.NextFilename) => void;
    [MatroskaElements.SegmentFamily]: (data: Elements.SegmentFamily) => void;
    [MatroskaElements.ChapterTranslate]: (data: Elements.ChapterTranslate) => void;
    [MatroskaElements.ChapterTranslateID]: (data: Elements.ChapterTranslateID) => void;
    [MatroskaElements.ChapterTranslateCodec]: (data: Elements.ChapterTranslateCodec) => void;
    [MatroskaElements.ChapterTranslateEditionUID]: (data: Elements.ChapterTranslateEditionUID) => void;
    [MatroskaElements.TimestampScale]: (data: Elements.TimestampScale) => void;
    [MatroskaElements.Duration]: (data: Elements.Duration) => void;
    [MatroskaElements.DateUTC]: (data: Elements.DateUTC) => void;
    [MatroskaElements.Title]: (data: Elements.Title) => void;
    [MatroskaElements.MuxingApp]: (data: Elements.MuxingApp) => void;
    [MatroskaElements.WritingApp]: (data: Elements.WritingApp) => void;
    [MatroskaElements.Cluster]: (data: Elements.Cluster) => void;
    [MatroskaElements.Timestamp]: (data: Elements.Timestamp) => void;
    [MatroskaElements.SilentTracks]: (data: Elements.SilentTracks) => void;
    [MatroskaElements.SilentTrackNumber]: (data: Elements.SilentTrackNumber) => void;
    [MatroskaElements.Position]: (data: Elements.Position) => void;
    [MatroskaElements.PrevSize]: (data: Elements.PrevSize) => void;
    [MatroskaElements.SimpleBlock]: (data: Elements.SimpleBlock) => void;
    [MatroskaElements.BlockGroup]: (data: Elements.BlockGroup) => void;
    [MatroskaElements.Block]: (data: Elements.Block) => void;
    [MatroskaElements.BlockVirtual]: (data: Elements.BlockVirtual) => void;
    [MatroskaElements.BlockAdditions]: (data: Elements.BlockAdditions) => void;
    [MatroskaElements.BlockMore]: (data: Elements.BlockMore) => void;
    [MatroskaElements.BlockAdditional]: (data: Elements.BlockAdditional) => void;
    [MatroskaElements.BlockAddID]: (data: Elements.BlockAddID) => void;
    [MatroskaElements.BlockDuration]: (data: Elements.BlockDuration) => void;
    [MatroskaElements.ReferencePriority]: (data: Elements.ReferencePriority) => void;
    [MatroskaElements.ReferenceBlock]: (data: Elements.ReferenceBlock) => void;
    [MatroskaElements.ReferenceVirtual]: (data: Elements.ReferenceVirtual) => void;
    [MatroskaElements.CodecState]: (data: Elements.CodecState) => void;
    [MatroskaElements.DiscardPadding]: (data: Elements.DiscardPadding) => void;
    [MatroskaElements.Slices]: (data: Elements.Slices) => void;
    [MatroskaElements.TimeSlice]: (data: Elements.TimeSlice) => void;
    [MatroskaElements.LaceNumber]: (data: Elements.LaceNumber) => void;
    [MatroskaElements.FrameNumber]: (data: Elements.FrameNumber) => void;
    [MatroskaElements.BlockAdditionID]: (data: Elements.BlockAdditionID) => void;
    [MatroskaElements.Delay]: (data: Elements.Delay) => void;
    [MatroskaElements.SliceDuration]: (data: Elements.SliceDuration) => void;
    [MatroskaElements.ReferenceFrame]: (data: Elements.ReferenceFrame) => void;
    [MatroskaElements.ReferenceOffset]: (data: Elements.ReferenceOffset) => void;
    [MatroskaElements.ReferenceTimestamp]: (data: Elements.ReferenceTimestamp) => void;
    [MatroskaElements.EncryptedBlock]: (data: Elements.EncryptedBlock) => void;
    [MatroskaElements.Tracks]: (data: Elements.Tracks) => void;
    [MatroskaElements.TrackEntry]: (data: Elements.TrackEntry) => void;
    [MatroskaElements.TrackNumber]: (data: Elements.TrackNumber) => void;
    [MatroskaElements.TrackUID]: (data: Elements.TrackUID) => void;
    [MatroskaElements.TrackType]: (data: Elements.TrackType) => void;
    [MatroskaElements.FlagEnabled]: (data: Elements.FlagEnabled) => void;
    [MatroskaElements.FlagDefault]: (data: Elements.FlagDefault) => void;
    [MatroskaElements.FlagForced]: (data: Elements.FlagForced) => void;
    [MatroskaElements.FlagHearingImpaired]: (data: Elements.FlagHearingImpaired) => void;
    [MatroskaElements.FlagVisualImpaired]: (data: Elements.FlagVisualImpaired) => void;
    [MatroskaElements.FlagTextDescriptions]: (data: Elements.FlagTextDescriptions) => void;
    [MatroskaElements.FlagOriginal]: (data: Elements.FlagOriginal) => void;
    [MatroskaElements.FlagCommentary]: (data: Elements.FlagCommentary) => void;
    [MatroskaElements.FlagLacing]: (data: Elements.FlagLacing) => void;
    [MatroskaElements.MinCache]: (data: Elements.MinCache) => void;
    [MatroskaElements.MaxCache]: (data: Elements.MaxCache) => void;
    [MatroskaElements.DefaultDuration]: (data: Elements.DefaultDuration) => void;
    [MatroskaElements.DefaultDecodedFieldDuration]: (data: Elements.DefaultDecodedFieldDuration) => void;
    [MatroskaElements.TrackTimestampScale]: (data: Elements.TrackTimestampScale) => void;
    [MatroskaElements.TrackOffset]: (data: Elements.TrackOffset) => void;
    [MatroskaElements.MaxBlockAdditionID]: (data: Elements.MaxBlockAdditionID) => void;
    [MatroskaElements.BlockAdditionMapping]: (data: Elements.BlockAdditionMapping) => void;
    [MatroskaElements.BlockAddIDValue]: (data: Elements.BlockAddIDValue) => void;
    [MatroskaElements.BlockAddIDName]: (data: Elements.BlockAddIDName) => void;
    [MatroskaElements.BlockAddIDType]: (data: Elements.BlockAddIDType) => void;
    [MatroskaElements.BlockAddIDExtraData]: (data: Elements.BlockAddIDExtraData) => void;
    [MatroskaElements.Name]: (data: Elements.Name) => void;
    [MatroskaElements.Language]: (data: Elements.Language) => void;
    [MatroskaElements.LanguageBCP47]: (data: Elements.LanguageBCP47) => void;
    [MatroskaElements.CodecID]: (data: Elements.CodecID) => void;
    [MatroskaElements.CodecPrivate]: (data: Elements.CodecPrivate) => void;
    [MatroskaElements.CodecName]: (data: Elements.CodecName) => void;
    [MatroskaElements.AttachmentLink]: (data: Elements.AttachmentLink) => void;
    [MatroskaElements.CodecSettings]: (data: Elements.CodecSettings) => void;
    [MatroskaElements.CodecInfoURL]: (data: Elements.CodecInfoURL) => void;
    [MatroskaElements.CodecDownloadURL]: (data: Elements.CodecDownloadURL) => void;
    [MatroskaElements.CodecDecodeAll]: (data: Elements.CodecDecodeAll) => void;
    [MatroskaElements.TrackOverlay]: (data: Elements.TrackOverlay) => void;
    [MatroskaElements.CodecDelay]: (data: Elements.CodecDelay) => void;
    [MatroskaElements.SeekPreRoll]: (data: Elements.SeekPreRoll) => void;
    [MatroskaElements.TrackTranslate]: (data: Elements.TrackTranslate) => void;
    [MatroskaElements.TrackTranslateTrackID]: (data: Elements.TrackTranslateTrackID) => void;
    [MatroskaElements.TrackTranslateCodec]: (data: Elements.TrackTranslateCodec) => void;
    [MatroskaElements.TrackTranslateEditionUID]: (data: Elements.TrackTranslateEditionUID) => void;
    [MatroskaElements.Video]: (data: Elements.Video) => void;
    [MatroskaElements.FlagInterlaced]: (data: Elements.FlagInterlaced) => void;
    [MatroskaElements.FieldOrder]: (data: Elements.FieldOrder) => void;
    [MatroskaElements.StereoMode]: (data: Elements.StereoMode) => void;
    [MatroskaElements.AlphaMode]: (data: Elements.AlphaMode) => void;
    [MatroskaElements.OldStereoMode]: (data: Elements.OldStereoMode) => void;
    [MatroskaElements.PixelWidth]: (data: Elements.PixelWidth) => void;
    [MatroskaElements.PixelHeight]: (data: Elements.PixelHeight) => void;
    [MatroskaElements.PixelCropBottom]: (data: Elements.PixelCropBottom) => void;
    [MatroskaElements.PixelCropTop]: (data: Elements.PixelCropTop) => void;
    [MatroskaElements.PixelCropLeft]: (data: Elements.PixelCropLeft) => void;
    [MatroskaElements.PixelCropRight]: (data: Elements.PixelCropRight) => void;
    [MatroskaElements.DisplayWidth]: (data: Elements.DisplayWidth) => void;
    [MatroskaElements.DisplayHeight]: (data: Elements.DisplayHeight) => void;
    [MatroskaElements.DisplayUnit]: (data: Elements.DisplayUnit) => void;
    [MatroskaElements.AspectRatioType]: (data: Elements.AspectRatioType) => void;
    [MatroskaElements.UncompressedFourCC]: (data: Elements.UncompressedFourCC) => void;
    [MatroskaElements.GammaValue]: (data: Elements.GammaValue) => void;
    [MatroskaElements.FrameRate]: (data: Elements.FrameRate) => void;
    [MatroskaElements.Colour]: (data: Elements.Colour) => void;
    [MatroskaElements.MatrixCoefficients]: (data: Elements.MatrixCoefficients) => void;
    [MatroskaElements.BitsPerChannel]: (data: Elements.BitsPerChannel) => void;
    [MatroskaElements.ChromaSubsamplingHorz]: (data: Elements.ChromaSubsamplingHorz) => void;
    [MatroskaElements.ChromaSubsamplingVert]: (data: Elements.ChromaSubsamplingVert) => void;
    [MatroskaElements.CbSubsamplingHorz]: (data: Elements.CbSubsamplingHorz) => void;
    [MatroskaElements.CbSubsamplingVert]: (data: Elements.CbSubsamplingVert) => void;
    [MatroskaElements.ChromaSitingHorz]: (data: Elements.ChromaSitingHorz) => void;
    [MatroskaElements.ChromaSitingVert]: (data: Elements.ChromaSitingVert) => void;
    [MatroskaElements.Range]: (data: Elements.Range) => void;
    [MatroskaElements.TransferCharacteristics]: (data: Elements.TransferCharacteristics) => void;
    [MatroskaElements.Primaries]: (data: Elements.Primaries) => void;
    [MatroskaElements.MaxCLL]: (data: Elements.MaxCLL) => void;
    [MatroskaElements.MaxFALL]: (data: Elements.MaxFALL) => void;
    [MatroskaElements.MasteringMetadata]: (data: Elements.MasteringMetadata) => void;
    [MatroskaElements.PrimaryRChromaticityX]: (data: Elements.PrimaryRChromaticityX) => void;
    [MatroskaElements.PrimaryRChromaticityY]: (data: Elements.PrimaryRChromaticityY) => void;
    [MatroskaElements.PrimaryGChromaticityX]: (data: Elements.PrimaryGChromaticityX) => void;
    [MatroskaElements.PrimaryGChromaticityY]: (data: Elements.PrimaryGChromaticityY) => void;
    [MatroskaElements.PrimaryBChromaticityX]: (data: Elements.PrimaryBChromaticityX) => void;
    [MatroskaElements.PrimaryBChromaticityY]: (data: Elements.PrimaryBChromaticityY) => void;
    [MatroskaElements.WhitePointChromaticityX]: (data: Elements.WhitePointChromaticityX) => void;
    [MatroskaElements.WhitePointChromaticityY]: (data: Elements.WhitePointChromaticityY) => void;
    [MatroskaElements.LuminanceMax]: (data: Elements.LuminanceMax) => void;
    [MatroskaElements.LuminanceMin]: (data: Elements.LuminanceMin) => void;
    [MatroskaElements.Projection]: (data: Elements.Projection) => void;
    [MatroskaElements.ProjectionType]: (data: Elements.ProjectionType) => void;
    [MatroskaElements.ProjectionPrivate]: (data: Elements.ProjectionPrivate) => void;
    [MatroskaElements.ProjectionPoseYaw]: (data: Elements.ProjectionPoseYaw) => void;
    [MatroskaElements.ProjectionPosePitch]: (data: Elements.ProjectionPosePitch) => void;
    [MatroskaElements.ProjectionPoseRoll]: (data: Elements.ProjectionPoseRoll) => void;
    [MatroskaElements.Audio]: (data: Elements.Audio) => void;
    [MatroskaElements.SamplingFrequency]: (data: Elements.SamplingFrequency) => void;
    [MatroskaElements.OutputSamplingFrequency]: (data: Elements.OutputSamplingFrequency) => void;
    [MatroskaElements.Channels]: (data: Elements.Channels) => void;
    [MatroskaElements.ChannelPositions]: (data: Elements.ChannelPositions) => void;
    [MatroskaElements.BitDepth]: (data: Elements.BitDepth) => void;
    [MatroskaElements.Emphasis]: (data: Elements.Emphasis) => void;
    [MatroskaElements.TrackOperation]: (data: Elements.TrackOperation) => void;
    [MatroskaElements.TrackCombinePlanes]: (data: Elements.TrackCombinePlanes) => void;
    [MatroskaElements.TrackPlane]: (data: Elements.TrackPlane) => void;
    [MatroskaElements.TrackPlaneUID]: (data: Elements.TrackPlaneUID) => void;
    [MatroskaElements.TrackPlaneType]: (data: Elements.TrackPlaneType) => void;
    [MatroskaElements.TrackJoinBlocks]: (data: Elements.TrackJoinBlocks) => void;
    [MatroskaElements.TrackJoinUID]: (data: Elements.TrackJoinUID) => void;
    [MatroskaElements.TrickTrackUID]: (data: Elements.TrickTrackUID) => void;
    [MatroskaElements.TrickTrackSegmentUID]: (data: Elements.TrickTrackSegmentUID) => void;
    [MatroskaElements.TrickTrackFlag]: (data: Elements.TrickTrackFlag) => void;
    [MatroskaElements.TrickMasterTrackUID]: (data: Elements.TrickMasterTrackUID) => void;
    [MatroskaElements.TrickMasterTrackSegmentUID]: (data: Elements.TrickMasterTrackSegmentUID) => void;
    [MatroskaElements.ContentEncodings]: (data: Elements.ContentEncodings) => void;
    [MatroskaElements.ContentEncoding]: (data: Elements.ContentEncoding) => void;
    [MatroskaElements.ContentEncodingOrder]: (data: Elements.ContentEncodingOrder) => void;
    [MatroskaElements.ContentEncodingScope]: (data: Elements.ContentEncodingScope) => void;
    [MatroskaElements.ContentEncodingType]: (data: Elements.ContentEncodingType) => void;
    [MatroskaElements.ContentCompression]: (data: Elements.ContentCompression) => void;
    [MatroskaElements.ContentCompAlgo]: (data: Elements.ContentCompAlgo) => void;
    [MatroskaElements.ContentCompSettings]: (data: Elements.ContentCompSettings) => void;
    [MatroskaElements.ContentEncryption]: (data: Elements.ContentEncryption) => void;
    [MatroskaElements.ContentEncAlgo]: (data: Elements.ContentEncAlgo) => void;
    [MatroskaElements.ContentEncKeyID]: (data: Elements.ContentEncKeyID) => void;
    [MatroskaElements.ContentEncAESSettings]: (data: Elements.ContentEncAESSettings) => void;
    [MatroskaElements.AESSettingsCipherMode]: (data: Elements.AESSettingsCipherMode) => void;
    [MatroskaElements.ContentSignature]: (data: Elements.ContentSignature) => void;
    [MatroskaElements.ContentSigKeyID]: (data: Elements.ContentSigKeyID) => void;
    [MatroskaElements.ContentSigAlgo]: (data: Elements.ContentSigAlgo) => void;
    [MatroskaElements.ContentSigHashAlgo]: (data: Elements.ContentSigHashAlgo) => void;
    [MatroskaElements.Cues]: (data: Elements.Cues) => void;
    [MatroskaElements.CuePoint]: (data: Elements.CuePoint) => void;
    [MatroskaElements.CueTime]: (data: Elements.CueTime) => void;
    [MatroskaElements.CueTrackPositions]: (data: Elements.CueTrackPositions) => void;
    [MatroskaElements.CueTrack]: (data: Elements.CueTrack) => void;
    [MatroskaElements.CueClusterPosition]: (data: Elements.CueClusterPosition) => void;
    [MatroskaElements.CueRelativePosition]: (data: Elements.CueRelativePosition) => void;
    [MatroskaElements.CueDuration]: (data: Elements.CueDuration) => void;
    [MatroskaElements.CueBlockNumber]: (data: Elements.CueBlockNumber) => void;
    [MatroskaElements.CueCodecState]: (data: Elements.CueCodecState) => void;
    [MatroskaElements.CueReference]: (data: Elements.CueReference) => void;
    [MatroskaElements.CueRefTime]: (data: Elements.CueRefTime) => void;
    [MatroskaElements.CueRefCluster]: (data: Elements.CueRefCluster) => void;
    [MatroskaElements.CueRefNumber]: (data: Elements.CueRefNumber) => void;
    [MatroskaElements.CueRefCodecState]: (data: Elements.CueRefCodecState) => void;
    [MatroskaElements.Attachments]: (data: Elements.Attachments) => void;
    [MatroskaElements.AttachedFile]: (data: Elements.AttachedFile) => void;
    [MatroskaElements.FileDescription]: (data: Elements.FileDescription) => void;
    [MatroskaElements.FileName]: (data: Elements.FileName) => void;
    [MatroskaElements.FileMediaType]: (data: Elements.FileMediaType) => void;
    [MatroskaElements.FileData]: (data: Elements.FileData) => void;
    [MatroskaElements.FileUID]: (data: Elements.FileUID) => void;
    [MatroskaElements.FileReferral]: (data: Elements.FileReferral) => void;
    [MatroskaElements.FileUsedStartTime]: (data: Elements.FileUsedStartTime) => void;
    [MatroskaElements.FileUsedEndTime]: (data: Elements.FileUsedEndTime) => void;
    [MatroskaElements.Chapters]: (data: Elements.Chapters) => void;
    [MatroskaElements.EditionEntry]: (data: Elements.EditionEntry) => void;
    [MatroskaElements.EditionUID]: (data: Elements.EditionUID) => void;
    [MatroskaElements.EditionFlagHidden]: (data: Elements.EditionFlagHidden) => void;
    [MatroskaElements.EditionFlagDefault]: (data: Elements.EditionFlagDefault) => void;
    [MatroskaElements.EditionFlagOrdered]: (data: Elements.EditionFlagOrdered) => void;
    [MatroskaElements.EditionDisplay]: (data: Elements.EditionDisplay) => void;
    [MatroskaElements.EditionString]: (data: Elements.EditionString) => void;
    [MatroskaElements.EditionLanguageIETF]: (data: Elements.EditionLanguageIETF) => void;
    [MatroskaElements.ChapterAtom]: (data: Elements.ChapterAtom) => void;
    [MatroskaElements.ChapterUID]: (data: Elements.ChapterUID) => void;
    [MatroskaElements.ChapterStringUID]: (data: Elements.ChapterStringUID) => void;
    [MatroskaElements.ChapterTimeStart]: (data: Elements.ChapterTimeStart) => void;
    [MatroskaElements.ChapterTimeEnd]: (data: Elements.ChapterTimeEnd) => void;
    [MatroskaElements.ChapterFlagHidden]: (data: Elements.ChapterFlagHidden) => void;
    [MatroskaElements.ChapterFlagEnabled]: (data: Elements.ChapterFlagEnabled) => void;
    [MatroskaElements.ChapterSegmentUUID]: (data: Elements.ChapterSegmentUUID) => void;
    [MatroskaElements.ChapterSkipType]: (data: Elements.ChapterSkipType) => void;
    [MatroskaElements.ChapterSegmentEditionUID]: (data: Elements.ChapterSegmentEditionUID) => void;
    [MatroskaElements.ChapterPhysicalEquiv]: (data: Elements.ChapterPhysicalEquiv) => void;
    [MatroskaElements.ChapterTrack]: (data: Elements.ChapterTrack) => void;
    [MatroskaElements.ChapterTrackUID]: (data: Elements.ChapterTrackUID) => void;
    [MatroskaElements.ChapterDisplay]: (data: Elements.ChapterDisplay) => void;
    [MatroskaElements.ChapString]: (data: Elements.ChapString) => void;
    [MatroskaElements.ChapLanguage]: (data: Elements.ChapLanguage) => void;
    [MatroskaElements.ChapLanguageBCP47]: (data: Elements.ChapLanguageBCP47) => void;
    [MatroskaElements.ChapCountry]: (data: Elements.ChapCountry) => void;
    [MatroskaElements.ChapProcess]: (data: Elements.ChapProcess) => void;
    [MatroskaElements.ChapProcessCodecID]: (data: Elements.ChapProcessCodecID) => void;
    [MatroskaElements.ChapProcessPrivate]: (data: Elements.ChapProcessPrivate) => void;
    [MatroskaElements.ChapProcessCommand]: (data: Elements.ChapProcessCommand) => void;
    [MatroskaElements.ChapProcessTime]: (data: Elements.ChapProcessTime) => void;
    [MatroskaElements.ChapProcessData]: (data: Elements.ChapProcessData) => void;
    [MatroskaElements.Tags]: (data: Elements.Tags) => void;
    [MatroskaElements.Tag]: (data: Elements.Tag) => void;
    [MatroskaElements.Targets]: (data: Elements.Targets) => void;
    [MatroskaElements.TargetTypeValue]: (data: Elements.TargetTypeValue) => void;
    [MatroskaElements.TargetType]: (data: Elements.TargetType) => void;
    [MatroskaElements.TagTrackUID]: (data: Elements.TagTrackUID) => void;
    [MatroskaElements.TagEditionUID]: (data: Elements.TagEditionUID) => void;
    [MatroskaElements.TagChapterUID]: (data: Elements.TagChapterUID) => void;
    [MatroskaElements.TagAttachmentUID]: (data: Elements.TagAttachmentUID) => void;
    [MatroskaElements.SimpleTag]: (data: Elements.SimpleTag) => void;
    [MatroskaElements.TagName]: (data: Elements.TagName) => void;
    [MatroskaElements.TagLanguage]: (data: Elements.TagLanguage) => void;
    [MatroskaElements.TagLanguageBCP47]: (data: Elements.TagLanguageBCP47) => void;
    [MatroskaElements.TagDefault]: (data: Elements.TagDefault) => void;
    [MatroskaElements.TagDefaultBogus]: (data: Elements.TagDefaultBogus) => void;
    [MatroskaElements.TagString]: (data: Elements.TagString) => void;
    [MatroskaElements.TagBinary]: (data: Elements.TagBinary) => void;
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Elements {
    export interface EBMLHead {
        EBMLVersion: EBMLVersion;
        EBMLReadVersion: EBMLReadVersion;
        EBMLMaxIDLength: EBMLMaxIDLength;
        EBMLMaxSizeLength: EBMLMaxSizeLength;
        DocType: DocType;
        DocTypeVersion: DocTypeVersion;
        DocTypeReadVersion: DocTypeReadVersion;
    }

    export type EBMLVersion = number;
    export type EBMLReadVersion = number;
    // export type EBMLMaxIDLength = number;
    // export type EBMLMaxSizeLength = number;
    export type DocType = string;
    export type DocTypeVersion = number;
    export type DocTypeReadVersion = number;
    export type CRC32 = ArrayBuffer;
    export interface SignatureSlot {
        SignatureAlgo?: SignatureAlgo;
        SignatureHash?: SignatureHash;
        SignaturePublicKey?: SignaturePublicKey;
        Signature?: Signature;
    }
    export enum SignatureAlgo {
        RSA = 1,
        elliptic = 2
    }
    export enum SignatureHash {
        SHA1_160 = 1,
        MD5 = 2
    }
    export type SignaturePublicKey = ArrayBuffer;
    export type Signature = ArrayBuffer;
    export interface SignatureElements {
        SignatureElementList?: SignatureElementList;
    }
    export interface SignatureElementList {
        SignedElement?: SignedElement;
    }
    export type SignedElement = ArrayBuffer;
    /**
     * @default 4
     * @range 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x42F2
     */
    export type EBMLMaxIDLength = number;

    /**
     * @default 8
     * @range 1-8
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x42F3
     */
    export type EBMLMaxSizeLength = number;

    /**
     * @definition
     * The `Root Element` that contains all other `Top-Level Elements`; see (#data-layout).
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x18538067
     */
    export interface Segment {
        SeekHead?: SeekHead[];
        Info: Info;
        Cluster?: Cluster[];
        Tracks?: Tracks;
        Cues?: Cues;
        Attachments?: Attachments;
        Chapters?: Chapters;
        Tags?: Tags[];
    }

    /**
     * @definition
     * Contains seeking information of `Top-Level Elements`; see (#data-layout).
     *
     * @maxOccurs 2
     * @id 0x114D9B74
     */
    export interface SeekHead {
        Seek: Seek[];
    }

    /**
     * @definition
     * Contains a single seek entry to an EBML Element.
     *
     * @minOccurs 1
     * @id 0x4DBB
     */
    export interface Seek {
        SeekID: SeekID;
        SeekPosition: SeekPosition;
    }

    /**
     * @definition
     * The binary EBML ID of a `Top-Level Element`.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x53AB
     */
    export type SeekID = ArrayBuffer;

    /**
     * @definition
     * The `Segment Position` ((#segment-position)) of a `Top-Level Element`.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x53AC
     */
    export type SeekPosition = number;

    /**
     * @definition
     * Contains general information about the `Segment`.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x1549A966
     */
    export interface Info {
        SegmentUUID?: SegmentUUID;
        SegmentFilename?: SegmentFilename;
        PrevUUID?: PrevUUID;
        PrevFilename?: PrevFilename;
        NextUUID?: NextUUID;
        NextFilename?: NextFilename;
        SegmentFamily?: SegmentFamily[];
        ChapterTranslate?: ChapterTranslate[];
        TimestampScale: TimestampScale;
        Duration?: Duration;
        DateUTC?: DateUTC;
        Title?: Title;
        MuxingApp: MuxingApp;
        WritingApp: WritingApp;
    }

    /**
     * @definition
     * A randomly generated UID that identifies the `Segment` amongst many others (128 bits). It is equivalent to a Universally Unique Identifier (UUID) v4 [@!RFC4122] with all bits randomly (or pseudorandomly) chosen.  An actual UUID v4 value, where some bits are not random, **MAY** also be used.
     *
     * @usage notes
     * If the `Segment` is a part of a `Linked Segment`, then this element is **REQUIRED**.
     * The value of the UID **MUST** contain at least one bit set to 1.
     *
     * @maxOccurs 1
     * @id 0x73A4
     */
    export type SegmentUUID = ArrayBuffer;

    /**
     * @definition
     * A filename corresponding to this `Segment`.
     *
     * @maxOccurs 1
     * @id 0x7384
     */
    export type SegmentFilename = string;

    /**
     * @definition
     * An ID that identifies the previous `Segment` of a `Linked Segment`.
     *
     * @usage notes
     * If the `Segment` is a part of a `Linked Segment` that uses
     * Hard Linking ((#hard-linking)),
     * then either the `PrevUUID` or the `NextUUID` element is **REQUIRED**. If a `Segment` contains a `PrevUUID` but not a `NextUUID`,
     * then it **MAY** be considered as the last `Segment` of the `Linked Segment`. The `PrevUUID` **MUST NOT** be equal to the `SegmentUUID`.
     *
     * @maxOccurs 1
     * @id 0x3CB923
     */
    export type PrevUUID = ArrayBuffer;

    /**
     * @definition
     * A filename corresponding to the file of the previous `Linked Segment`.
     *
     * @usage notes
     * Provision of the previous filename is for display convenience,
     * but `PrevUUID` **SHOULD** be considered authoritative for identifying the previous `Segment` in a `Linked Segment`.
     *
     * @maxOccurs 1
     * @id 0x3C83AB
     */
    export type PrevFilename = string;

    /**
     * @definition
     * An ID that identifies the next `Segment` of a `Linked Segment`.
     *
     * @usage notes
     * If the `Segment` is a part of a `Linked Segment` that uses Hard Linking ((#hard-linking)),
     * then either the `PrevUUID` or the `NextUUID` element is **REQUIRED**. If a `Segment` contains a `NextUUID` but not a `PrevUUID`,
     * then it **MAY** be considered as the first `Segment` of the `Linked Segment`. The `NextUUID` **MUST NOT** be equal to the `SegmentUUID`.
     *
     * @maxOccurs 1
     * @id 0x3EB923
     */
    export type NextUUID = ArrayBuffer;

    /**
     * @definition
     * A filename corresponding to the file of the next `Linked Segment`.
     *
     * @usage notes
     * Provision of the next filename is for display convenience,
     * but `NextUUID` **SHOULD** be considered authoritative for identifying the Next `Segment`.
     *
     * @maxOccurs 1
     * @id 0x3E83BB
     */
    export type NextFilename = string;

    /**
     * @definition
     * A UID that all `Segments` of a `Linked Segment` **MUST** share (128 bits). It is equivalent to a UUID v4 [@!RFC4122] with all bits randomly (or pseudorandomly) chosen. An actual UUID v4 value, where some bits are not random, **MAY** also be used.
     *
     * @usage notes
     * If the `Segment` `Info` contains a `ChapterTranslate` element, this element is **REQUIRED**.
     *
     * @id 0x4444
     */
    export type SegmentFamily = ArrayBuffer;

    /**
     * @definition
     * The mapping between this `Segment` and a segment value in the given Chapter Codec.
     *
     * @rationale
     * Chapter Codecs may need to address different segments, but they may not know of the way to identify such segments when stored in Matroska.
     * This element and its child elements add a way to map the internal segments known to the Chapter Codec to the `SegmentUUID`s in Matroska.
     * This allows remuxing a file with Chapter Codec without changing the content of the codec data, just the `Segment` mapping.
     *
     * @id 0x6924
     */
    export interface ChapterTranslate {
        ChapterTranslateID: ChapterTranslateID;
        ChapterTranslateCodec: ChapterTranslateCodec;
        ChapterTranslateEditionUID?: ChapterTranslateEditionUID[];
    }

    /**
     * @definition
     * The binary value used to represent this `Segment` in the chapter codec data.
     * The format depends on the `ChapProcessCodecID` used; see (#chapprocesscodecid-element).
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x69A5
     */
    export type ChapterTranslateID = ArrayBuffer;

    /**
     * @definition
     * Applies to the chapter codec of the given chapter edition(s); see (#chapprocesscodecid-element).
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x69BF
     */
    export type ChapterTranslateCodec = number;

    /**
     * @definition
     * Specifies a chapter edition UID to which this `ChapterTranslate` applies.
     *
     * @usage notes
     * When no `ChapterTranslateEditionUID` is specified in the `ChapterTranslate`, the `ChapterTranslate` applies to all chapter editions found in the `Segment` using the given `ChapterTranslateCodec`.
     *
     * @id 0x69FC
     */
    export type ChapterTranslateEditionUID = number;

    /**
     * @definition
     * Base unit for Segment Ticks and Track Ticks, in nanoseconds. A `TimestampScale` value of 1000000 means scaled timestamps in the `Segment` are expressed in milliseconds; see (#timestamps) on how to interpret timestamps.
     *
     * @default 1000000
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x2AD7B1
     */
    export type TimestampScale = number;

    /**
     * @definition
     * Duration of the `Segment`, expressed in `Segment` Ticks, which are based on `TimestampScale`; see (#timestamp-ticks).
     *
     * @range > 0x0p+0
     * @maxOccurs 1
     * @id 0x4489
     */
    export type Duration = number;

    /**
     * @definition
     * The date and time that the `Segment` was created by the muxing application or library.
     *
     * @maxOccurs 1
     * @id 0x4461
     */
    export type DateUTC = Date;

    /**
     * @definition
     * General name of the `Segment`.
     *
     * @maxOccurs 1
     * @id 0x7BA9
     */
    export type Title = string;

    /**
     * @definition
     * Muxing application or library (example: "libmatroska-0.4.3").
     *
     * @usage notes
     * Include the full name of the application or library followed by the version number.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x4D80
     */
    export type MuxingApp = string;

    /**
     * @definition
     * Writing application (example: "mkvmerge-0.3.3").
     *
     * @usage notes
     * Include the full name of the application followed by the version number.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x5741
     */
    export type WritingApp = string;

    /**
     * @definition
     * The `Top-Level Element` containing the (monolithic) `Block` structure.
     *
     * @id 0x1F43B675
     */
    export interface Cluster {
        Timestamp: Timestamp;
        SilentTracks?: SilentTracks;
        Position?: Position;
        PrevSize?: PrevSize;
        SimpleBlock?: SimpleBlock[];
        BlockGroup?: BlockGroup[];
        EncryptedBlock?: EncryptedBlock[];
    }

    /**
     * @definition
     * Absolute timestamp of the cluster, expressed in Segment Ticks, which are based on `TimestampScale`; see (#timestamp-ticks).
     *
     * @usage notes
     * This element **SHOULD** be the first child element of the `Cluster` it belongs to
     * or the second if that `Cluster` contains a `CRC-32` element ((#crc-32)).
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xE7
     */
    export type Timestamp = number;

    /**
     * @definition
     * The list of tracks that are not used in that part of the stream.
     * It is useful when using overlay tracks for seeking or deciding what track to use.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x5854
     */
    export interface SilentTracks {
        SilentTrackNumber?: SilentTrackNumber[];
    }

    /**
     * @definition
     * One of the track numbers that is not used from now on in the stream.
     * It could change later if not specified as silent in a further `Cluster`.
     *
     * @minver 0
     * @maxver 0
     * @id 0x58D7
     */
    export type SilentTrackNumber = number;

    /**
     * @definition
     * The `Segment Position` of the `Cluster` in the `Segment` (0 in live streams).
     * It might help to resynchronize the offset on damaged streams.
     *
     * @maxver 4
     * @maxOccurs 1
     * @id 0xA7
     */
    export type Position = number;

    /**
     * @definition
     * Size of the previous `Cluster`, in octets. Can be useful for backward playing.
     *
     * @maxOccurs 1
     * @id 0xAB
     */
    export type PrevSize = number;

    /**
     * @definition
     * Similar to `Block` (see (#block-structure)) but without all the extra information.
     * Mostly used to reduce overhead when no extra feature is needed; see (#simpleblock-structure) on `SimpleBlock` Structure.
     *
     * @minver 2
     * @id 0xA3
     */
    export type SimpleBlock = ArrayBuffer;

    /**
     * @definition
     * Basic container of information containing a single `Block` and information specific to that `Block`.
     *
     * @id 0xA0
     */
    export interface BlockGroup {
        Block: Block;
        BlockVirtual?: BlockVirtual;
        BlockAdditions?: BlockAdditions;
        BlockDuration?: BlockDuration;
        ReferencePriority: ReferencePriority;
        ReferenceBlock?: ReferenceBlock[];
        ReferenceVirtual?: ReferenceVirtual;
        CodecState?: CodecState;
        DiscardPadding?: DiscardPadding;
        Slices?: Slices;
        ReferenceFrame?: ReferenceFrame;
    }

    /**
     * @definition
     * `Block` containing the actual data to be rendered and a timestamp relative to the `Cluster` Timestamp;
     * see (#block-structure) on `Block` Structure.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xA1
     */
    export type Block = ArrayBuffer;

    /**
     * @definition
     * A `Block` with no data. It must be stored in the stream at the place the real `Block` would be in display order.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xA2
     */
    export type BlockVirtual = ArrayBuffer;

    /**
     * @definition
     * Contains additional binary data to complete the `Block` element; see [@?I-D.ietf-cellar-codec, section 4.1.5] for more information.
     * An EBML parser that has no knowledge of the `Block` structure could still see and use/skip these data.
     *
     * @maxOccurs 1
     * @id 0x75A1
     */
    export interface BlockAdditions {
        BlockMore: BlockMore[];
    }

    /**
     * @definition
     * Contains the `BlockAdditional` and some parameters.
     *
     * @minOccurs 1
     * @id 0xA6
     */
    export interface BlockMore {
        BlockAdditional: BlockAdditional;
        BlockAddID: BlockAddID;
    }

    /**
     * @definition
     * Interpreted by the codec as it wishes (using the `BlockAddID`).
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xA5
     */
    export type BlockAdditional = ArrayBuffer;

    /**
     * @definition
     * An ID that identifies how to interpret the `BlockAdditional` data; see [@?I-D.ietf-cellar-codec, section 4.1.5] for more information.
     * A value of 1 indicates that the `BlockAdditional` data is defined by the codec.
     * Any other value indicates that the `BlockAdditional` data should be handled according to the `BlockAddIDType` that is located in the
     * `TrackEntry`.
     *
     * @usage notes
     * Each `BlockAddID` value **MUST** be unique between all `BlockMore` elements found in a `BlockAdditions` element. To keep `MaxBlockAdditionID` as low as possible, small values **SHOULD** be used.
     *
     * @default 1
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xEE
     */
    export type BlockAddID = number;

    /**
     * @definition
     * The duration of the `Block`, expressed in Track Ticks; see (#timestamp-ticks).
     * The `BlockDuration` element can be useful at the end of a `Track` to define the duration of the last frame (as there is no subsequent `Block` available)
     * or when there is a break in a track like for subtitle tracks.
     *
     * @maxOccurs 1
     * @id 0x9B
     */
    export type BlockDuration = number;

    /**
     * @definition
     * This frame is referenced and has the specified cache priority.
     * In the cache, only a frame of the same or higher priority can replace this frame. A value of 0 means the frame is not referenced.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xFA
     */
    export type ReferencePriority = number;

    /**
     * @definition
     * A timestamp value, relative to the timestamp of the `Block` in this `BlockGroup`, expressed in Track Ticks; see (#timestamp-ticks).
     * This is used to reference other frames necessary to decode this frame.
     * The relative value **SHOULD** correspond to a valid `Block` that this `Block` depends on.
     * Historically, `Matroska Writers` didn't write the actual `Block(s)` that this `Block` depends on, but they did write *some* `Block(s)` in the past.
     *
     * The value "0" **MAY** also be used to signify that this `Block` cannot be decoded on its own, but the necessary reference `Block(s)` is unknown. In this case, other `ReferenceBlock` elements **MUST NOT** be found in the same `BlockGroup`.
     *
     * If the `BlockGroup` doesn't have a `ReferenceBlock` element, then the `Block` it contains can be decoded without using any other `Block` data.
     *
     * @id 0xFB
     */
    export type ReferenceBlock = number;

    /**
     * @definition
     * The `Segment Position` of the data that would otherwise be in position of the virtual block.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xFD
     */
    export type ReferenceVirtual = number;

    /**
     * @definition
     * The new codec state to use. Data interpretation is private to the codec.
     * This information **SHOULD** always be referenced by a seek entry.
     *
     * @minver 2
     * @maxOccurs 1
     * @id 0xA4
     */
    export type CodecState = ArrayBuffer;

    /**
     * @definition
     * Duration of the silent data added to the `Block`, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks)
     * (padding at the end of the `Block` for positive values and at the beginning of the `Block` for negative values).
     * The duration of `DiscardPadding` is not calculated in the duration of the `TrackEntry` and **SHOULD** be discarded during playback.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x75A2
     */
    export type DiscardPadding = number;

    /**
     * @definition
     * Contains slices description.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x8E
     */
    export interface Slices {
        TimeSlice?: TimeSlice[];
    }

    /**
     * @definition
     * Contains extra time information about the data contained in the `Block`.
     * Being able to interpret this element is not required for playback.
     *
     * @minver 0
     * @maxver 0
     * @id 0xE8
     */
    export interface TimeSlice {
        LaceNumber?: LaceNumber;
        FrameNumber?: FrameNumber;
        BlockAdditionID?: BlockAdditionID;
        Delay?: Delay;
        SliceDuration?: SliceDuration;
    }

    /**
     * @definition
     * The reverse number of the frame in the lace (0 is the last frame, 1 is the next to last, etc.).
     * Being able to interpret this element is not required for playback.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xCC
     */
    export type LaceNumber = number;

    /**
     * @definition
     * The number of the frame to generate from this lace with this delay
     * (allows for the generation of many frames from the same Block/Frame).
     *
     * @default 0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xCD
     */
    export type FrameNumber = number;

    /**
     * @definition
     * The ID of the `BlockAdditional` element (0 is the main `Block`).
     *
     * @default 0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xCB
     */
    export type BlockAdditionID = number;

    /**
     * @definition
     * The delay to apply to the element, expressed in Track Ticks; see (#timestamp-ticks).
     *
     * @default 0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xCE
     */
    export type Delay = number;

    /**
     * @definition
     * The duration to apply to the element, expressed in Track Ticks; see (#timestamp-ticks).
     *
     * @default 0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xCF
     */
    export type SliceDuration = number;

    /**
     * @definition
     * Contains information about the last reference frame. See [@?DivXTrickTrack].
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xC8
     */
    export interface ReferenceFrame {
        ReferenceOffset?: ReferenceOffset;
        ReferenceTimestamp?: ReferenceTimestamp;
    }

    /**
     * @definition
     * The relative offset, in bytes, from the previous `BlockGroup` element for this Smooth FF/RW video track to the containing `BlockGroup`
     * element. See [@?DivXTrickTrack].
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xC9
     */
    export type ReferenceOffset = number;

    /**
     * @definition
     * The timestamp of the `BlockGroup` pointed to by ReferenceOffset, expressed in Track Ticks; see (#timestamp-ticks). See [@?DivXTrickTrack].
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xCA
     */
    export type ReferenceTimestamp = number;

    /**
     * @definition
     * Similar to `SimpleBlock` (see (#simpleblock-structure)),
     * but the data inside the `Block` are Transformed (encrypted and/or signed).
     *
     * @minver 0
     * @maxver 0
     * @id 0xAF
     */
    export type EncryptedBlock = ArrayBuffer;

    /**
     * @definition
     * A `Top-Level Element` of information with many tracks described.
     *
     * @maxOccurs 1
     * @id 0x1654AE6B
     */
    export interface Tracks {
        TrackEntry: TrackEntry[];
    }

    /**
     * @definition
     * Describes a track with all elements.
     *
     * @minOccurs 1
     * @id 0xAE
     */
    export interface TrackEntry {
        TrackNumber: TrackNumber;
        TrackUID: TrackUID;
        TrackType: TrackType;
        FlagEnabled?: FlagEnabled;
        FlagDefault: FlagDefault;
        FlagForced: FlagForced;
        FlagHearingImpaired?: FlagHearingImpaired;
        FlagVisualImpaired?: FlagVisualImpaired;
        FlagTextDescriptions?: FlagTextDescriptions;
        FlagOriginal?: FlagOriginal;
        FlagCommentary?: FlagCommentary;
        FlagLacing: FlagLacing;
        MinCache?: MinCache;
        MaxCache?: MaxCache;
        DefaultDuration?: DefaultDuration;
        DefaultDecodedFieldDuration?: DefaultDecodedFieldDuration;
        TrackTimestampScale?: TrackTimestampScale;
        TrackOffset?: TrackOffset;
        MaxBlockAdditionID: MaxBlockAdditionID;
        BlockAdditionMapping?: BlockAdditionMapping[];
        Name?: Name;
        Language: Language;
        LanguageBCP47?: LanguageBCP47;
        CodecID: CodecID;
        CodecPrivate?: CodecPrivate;
        CodecName?: CodecName;
        AttachmentLink?: AttachmentLink;
        CodecSettings?: CodecSettings;
        CodecInfoURL?: CodecInfoURL[];
        CodecDownloadURL?: CodecDownloadURL[];
        CodecDecodeAll?: CodecDecodeAll;
        TrackOverlay?: TrackOverlay[];
        CodecDelay?: CodecDelay;
        SeekPreRoll?: SeekPreRoll;
        TrackTranslate?: TrackTranslate[];
        Video?: Video;
        Audio?: Audio;
        TrackOperation?: TrackOperation;
        TrickTrackUID?: TrickTrackUID;
        TrickTrackSegmentUID?: TrickTrackSegmentUID;
        TrickTrackFlag?: TrickTrackFlag;
        TrickMasterTrackUID?: TrickMasterTrackUID;
        TrickMasterTrackSegmentUID?: TrickMasterTrackSegmentUID;
        ContentEncodings?: ContentEncodings;
    }

    /**
     * @definition
     * The track number as used in the `Block` Header.
     *
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xD7
     */
    export type TrackNumber = number;

    /**
     * @definition
     * A UID that identifies the `Track`.
     *
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x73C5
     */
    export type TrackUID = number;

    /**
     * @definition
     * The `TrackType` defines the type of each frame found in the `Track`.
     * The value **SHOULD** be stored on 1 octet.
     *
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x83
     */
    export enum TrackType {
        /**
         * @definition
         * An image.
         *
         */
        Video = 1,
        /**
         * @definition
         * Audio samples.
         *
         */
        Audio = 2,
        /**
         * @definition
         * A mix of different other `TrackType`. The codec needs to define how the `Matroska Player` should interpret such data.
         *
         */
        Complex = 3,
        /**
         * @definition
         * An image to be rendered over the video track(s).
         *
         */
        Logo = 16,
        /**
         * @definition
         * Subtitle or closed caption data to be rendered over the video track(s).
         *
         */
        Subtitle = 17,
        /**
         * @definition
         * Interactive button(s) to be rendered over the video track(s).
         *
         */
        Buttons = 18,
        /**
         * @definition
         * Metadata used to control the player of the `Matroska Player`.
         *
         */
        Control = 32,
        /**
         * @definition
         * Timed metadata that can be passed on to the `Matroska Player`.
         *
         */
        Metadata = 33
    }

    /**
     * @definition
     * Set to 1 if the track is usable. It is possible to turn a track that is not usable into a usable track using chapter codecs or control tracks.
     *
     * @default 1
     * @range 0-1
     * @minver 2
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xB9
     */
    export type FlagEnabled = number;

    /**
     * @definition
     * Set to 1 if the track (audio, video, or subtitles) is eligible for automatic selection by the player; see (#default-track-selection) for more details.
     *
     * @default 1
     * @range 0-1
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x88
     */
    export type FlagDefault = number;

    /**
     * @definition
     * Applies only to subtitles. Set to 1 if the track is eligible for automatic selection by the player if it matches the user's language preference,
     * even if the user's preferences would not normally enable subtitles with the selected audio track;
     * this can be used for tracks containing only translations of audio in foreign languages or on-screen text.
     * See (#default-track-selection) for more details.
     *
     * @default 0
     * @range 0-1
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x55AA
     */
    export type FlagForced = number;

    /**
     * @definition
     * Set to 1 if and only if the track is suitable for users with hearing impairments.
     *
     * @range 0-1
     * @minver 4
     * @maxOccurs 1
     * @id 0x55AB
     */
    export type FlagHearingImpaired = number;

    /**
     * @definition
     * Set to 1 if and only if the track is suitable for users with visual impairments.
     *
     * @range 0-1
     * @minver 4
     * @maxOccurs 1
     * @id 0x55AC
     */
    export type FlagVisualImpaired = number;

    /**
     * @definition
     * Set to 1 if and only if the track contains textual descriptions of video content.
     *
     * @range 0-1
     * @minver 4
     * @maxOccurs 1
     * @id 0x55AD
     */
    export type FlagTextDescriptions = number;

    /**
     * @definition
     * Set to 1 if and only if the track is in the content's original language.
     *
     * @range 0-1
     * @minver 4
     * @maxOccurs 1
     * @id 0x55AE
     */
    export type FlagOriginal = number;

    /**
     * @definition
     * Set to 1 if and only if the track contains commentary.
     *
     * @range 0-1
     * @minver 4
     * @maxOccurs 1
     * @id 0x55AF
     */
    export type FlagCommentary = number;

    /**
     * @definition
     * Set to 1 if the track **MAY** contain blocks that use lacing. When set to 0, all blocks **MUST** have their lacing flags set to "no lacing"; see (#block-lacing) on 'Block' Lacing.
     *
     * @default 1
     * @range 0-1
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x9C
     */
    export type FlagLacing = number;

    /**
     * @definition
     * The minimum number of frames a player should be able to cache during playback.
     * If set to 0, the reference pseudo-cache system is not used.
     *
     * @default 0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x6DE7
     */
    export type MinCache = number;

    /**
     * @definition
     * The maximum cache size necessary to store referenced frames in and the current frame.
     * 0 means no cache is needed.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x6DF8
     */
    export type MaxCache = number;

    /**
     * @definition
     * Number of nanoseconds per frame, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks)
     * ("frame" in the Matroska sense -- one element put into a (Simple)Block).
     *
     * @range not 0
     * @maxOccurs 1
     * @id 0x23E383
     */
    export type DefaultDuration = number;

    /**
     * @definition
     * The period between two successive fields at the output of the decoding process, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks).
     * See (#defaultdecodedfieldduration) for more information.
     *
     * @range not 0
     * @minver 4
     * @maxOccurs 1
     * @id 0x234E7A
     */
    export type DefaultDecodedFieldDuration = number;

    /**
     * @definition
     * The scale to apply on this track to work at normal speed in relation with other tracks
     * (mostly used to adjust video speed when the audio length differs).
     *
     * @default 0x1p+0
     * @range > 0x0p+0
     * @maxver 3
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x23314F
     */
    export type TrackTimestampScale = number;

    /**
     * @definition
     * A value to add to the `Block`'s Timestamp, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks).
     * This can be used to adjust the playback offset of a track.
     *
     * @default 0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x537F
     */
    export type TrackOffset = number;

    /**
     * @definition
     * The maximum value of `BlockAddID` ((#blockaddid-element)).
     * A value of 0 means there is no `BlockAdditions` ((#blockadditions-element)) for this track.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x55EE
     */
    export type MaxBlockAdditionID = number;

    /**
     * @definition
     * Contains elements that extend the track format by adding content either to each frame,
     * with `BlockAddID` ((#blockaddid-element)), or to the track as a whole
     * with `BlockAddIDExtraData`.
     *
     * @minver 4
     * @id 0x41E4
     */
    export interface BlockAdditionMapping {
        BlockAddIDValue?: BlockAddIDValue;
        BlockAddIDName?: BlockAddIDName;
        BlockAddIDType?: BlockAddIDType;
        BlockAddIDExtraData?: BlockAddIDExtraData;
    }

    /**
     * @definition
     * If the track format extension needs content beside frames,
     * the value refers to the `BlockAddID` ((#blockaddid-element)) value being described.
     *
     * @usage notes
     * To keep `MaxBlockAdditionID` as low as possible, small values **SHOULD** be used.
     *
     * @range >=2
     * @minver 4
     * @maxOccurs 1
     * @id 0x41F0
     */
    export type BlockAddIDValue = number;

    /**
     * @definition
     * A human-friendly name describing the type of `BlockAdditional` data,
     * as defined by the associated `Block Additional Mapping`.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x41A4
     */
    export type BlockAddIDName = string;

    /**
     * @definition
     * Stores the registered identifier of the `Block Additional Mapping`
     * to define how the `BlockAdditional` data should be handled.
     *
     * @usage notes
     * If `BlockAddIDType` is 0, the `BlockAddIDValue` and corresponding `BlockAddID` values **MUST** be 1.
     *
     * @default 0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x41E7
     */
    export type BlockAddIDType = number;

    /**
     * @definition
     * Extra binary data that the `BlockAddIDType` can use to interpret the `BlockAdditional` data.
     * The interpretation of the binary data depends on the `BlockAddIDType` value and the corresponding `Block Additional Mapping`.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x41ED
     */
    export type BlockAddIDExtraData = ArrayBuffer;

    /**
     * @definition
     * A human-readable track name.
     *
     * @maxOccurs 1
     * @id 0x536E
     */
    export type Name = string;

    /**
     * @definition
     * The language of the track,
     * in the Matroska languages form; see (#language-codes) on language codes.
     * This element **MUST** be ignored if the `LanguageBCP47` element is used in the same `TrackEntry`.
     *
     * @default eng
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x22B59C
     */
    export type Language = string;

    /**
     * @definition
     * The language of the track,
     * in the form defined in [@!RFC5646]; see (#language-codes) on language codes.
     * If this element is used, then any `Language` elements used in the same `TrackEntry` **MUST** be ignored.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x22B59D
     */
    export type LanguageBCP47 = string;

    /**
     * @definition
     * An ID corresponding to the codec;
     * see [@?I-D.ietf-cellar-codec] for more info.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x86
     */
    export type CodecID = string;

    /**
     * @definition
     * Private data only known to the codec.
     *
     * @maxOccurs 1
     * @id 0x63A2
     */
    export type CodecPrivate = ArrayBuffer;

    /**
     * @definition
     * A human-readable string specifying the codec.
     *
     * @maxOccurs 1
     * @id 0x258688
     */
    export type CodecName = string;

    /**
     * @definition
     * The UID of an attachment that is used by this codec.
     *
     * @usage notes
     * The value **MUST** match the `FileUID` value of an attachment found in this `Segment`.
     *
     * @range not 0
     * @maxver 3
     * @maxOccurs 1
     * @id 0x7446
     */
    export type AttachmentLink = number;

    /**
     * @definition
     * A string describing the encoding setting used.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x3A9697
     */
    export type CodecSettings = string;

    /**
     * @definition
     * A URL to find information about the codec used.
     *
     * @minver 0
     * @maxver 0
     * @id 0x3B4040
     */
    export type CodecInfoURL = string;

    /**
     * @definition
     * A URL to download information about the codec used.
     *
     * @minver 0
     * @maxver 0
     * @id 0x26B240
     */
    export type CodecDownloadURL = string;

    /**
     * @definition
     * Set to 1 if the codec can decode potentially damaged data.
     *
     * @default 1
     * @range 0-1
     * @maxver 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xAA
     */
    export type CodecDecodeAll = number;

    /**
     * @definition
     * Specify that this track is an overlay track for the `Track` specified (in the u-integer).
     * This means that when this track has a gap on `SilentTracks`,
     * the overlay track should be used instead. The order of multiple `TrackOverlay` matters; the first one is the one that should be used.
     * If the first one is not found, it should be the second, etc.
     *
     * @maxver 0
     * @id 0x6FAB
     */
    export type TrackOverlay = number;

    /**
     * @definition
     * The built-in delay for the codec, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks).
     * It represents the number of codec samples that will be discarded by the decoder during playback.
     * This timestamp value **MUST** be subtracted from each frame timestamp in order to get the timestamp that will be actually played.
     * The value **SHOULD** be small so the muxing of tracks with the same actual timestamp are in the same `Cluster`.
     *
     * @default 0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x56AA
     */
    export type CodecDelay = number;

    /**
     * @definition
     * After a discontinuity, the duration of the data
     * that the decoder **MUST** decode before the decoded data is valid, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks).
     *
     * @default 0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x56BB
     */
    export type SeekPreRoll = number;

    /**
     * @definition
     * The mapping between this `TrackEntry` and a track value in the given Chapter Codec.
     *
     * @rationale
     * Chapter Codecs may need to address content in a specific track, but they may not know of the way to identify tracks in Matroska.
     * This element and its child elements add a way to map the internal tracks known to the Chapter Codec to the track IDs in Matroska.
     * This allows remuxing a file with Chapter Codec without changing the content of the codec data, just the track mapping.
     *
     * @id 0x6624
     */
    export interface TrackTranslate {
        TrackTranslateTrackID: TrackTranslateTrackID;
        TrackTranslateCodec: TrackTranslateCodec;
        TrackTranslateEditionUID?: TrackTranslateEditionUID[];
    }

    /**
     * @definition
     * The binary value used to represent this `TrackEntry` in the chapter codec data.
     * The format depends on the `ChapProcessCodecID` used; see (#chapprocesscodecid-element).
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x66A5
     */
    export type TrackTranslateTrackID = ArrayBuffer;

    /**
     * @definition
     * Applies to the chapter codec of the given chapter edition(s); see (#chapprocesscodecid-element).
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x66BF
     */
    export type TrackTranslateCodec = number;

    /**
     * @definition
     * Specifies a chapter edition UID to which this `TrackTranslate` applies.
     *
     * @usage notes
     * When no `TrackTranslateEditionUID` is specified in the `TrackTranslate`, the `TrackTranslate` applies to all chapter editions found in the `Segment` using the given `TrackTranslateCodec`.
     *
     * @id 0x66FC
     */
    export type TrackTranslateEditionUID = number;

    /**
     * @definition
     * Video settings.
     *
     * @maxOccurs 1
     * @id 0xE0
     */
    export interface Video {
        FlagInterlaced?: FlagInterlaced;
        FieldOrder?: FieldOrder;
        StereoMode?: StereoMode;
        AlphaMode?: AlphaMode;
        OldStereoMode?: OldStereoMode;
        PixelWidth: PixelWidth;
        PixelHeight: PixelHeight;
        PixelCropBottom: PixelCropBottom;
        PixelCropTop: PixelCropTop;
        PixelCropLeft: PixelCropLeft;
        PixelCropRight: PixelCropRight;
        DisplayWidth?: DisplayWidth;
        DisplayHeight?: DisplayHeight;
        DisplayUnit: DisplayUnit;
        AspectRatioType?: AspectRatioType;
        UncompressedFourCC?: UncompressedFourCC;
        GammaValue?: GammaValue;
        FrameRate?: FrameRate;
        Colour?: Colour;
        Projection?: Projection;
    }

    /**
     * @definition
     * Specifies whether the video frames in this track are interlaced.
     *
     * @default 0
     * @minver 2
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x9A
     */
    export enum FlagInterlaced {
        /**
         * @definition
         * Unknown status.
         *
         * @usage notes
         * This value **SHOULD** be avoided.
         *
         */
        Undetermined = 0,
        /**
         * @definition
         * Interlaced frames.
         *
         */
        Interlaced = 1,
        /**
         * @definition
         * No interlacing.
         *
         */
        Progressive = 2
    }

    /**
     * @definition
     * Specifies the field ordering of video frames in this track.
     *
     * @usage notes
     * If `FlagInterlaced` is not set to 1, this element **MUST** be ignored.
     *
     * @default 2
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x9D
     */
    export enum FieldOrder {
        /**
         * @definition
         * Interlaced frames.
         *
         * @usage notes
         * This value **SHOULD** be avoided; setting `FlagInterlaced` to 2 is sufficient.
         *
         */
        Progressive = 0,
        /**
         * @definition
         * Top field displayed first. Top field stored first.
         *
         */
        Tff = 1,
        /**
         * @definition
         * Unknown field order.
         *
         * @usage notes
         * This value **SHOULD** be avoided.
         *
         */
        Undetermined = 2,
        /**
         * @definition
         * Bottom field displayed first. Bottom field stored first.
         *
         */
        Bff = 6,
        /**
         * @definition
         * Top field displayed first. Fields are interleaved in storage with the top line of the top field stored first.
         *
         */
        TffInterleaved = 9,
        /**
         * @definition
         * Bottom field displayed first. Fields are interleaved in storage with the top line of the top field stored first.
         *
         */
        BffInterleaved = 14
    }

    /**
     * @definition
     * Stereo-3D video mode. See (#multi-planar-and-3d-videos) for more details.
     *
     * @default 0
     * @minver 3
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x53B8
     */
    export enum StereoMode {
        /**
         */
        Mono = 0,
        /**
         */
        SideBySideLeftEyeFirst = 1,
        /**
         */
        TopBottomRightEyeIsFirst = 2,
        /**
         */
        TopBottomLeftEyeIsFirst = 3,
        /**
         */
        CheckboardRightEyeIsFirst = 4,
        /**
         */
        CheckboardLeftEyeIsFirst = 5,
        /**
         */
        RowInterleavedRightEyeIsFirst = 6,
        /**
         */
        RowInterleavedLeftEyeIsFirst = 7,
        /**
         */
        ColumnInterleavedRightEyeIsFirst = 8,
        /**
         */
        ColumnInterleavedLeftEyeIsFirst = 9,
        /**
         */
        AnaglyphCyanRed = 10,
        /**
         */
        SideBySideRightEyeFirst = 11,
        /**
         */
        AnaglyphGreenMagenta = 12,
        /**
         */
        BothEyesLacedInOneBlockLeftEyeIsFirst = 13,
        /**
         */
        BothEyesLacedInOneBlockRightEyeIsFirst = 14
    }

    /**
     * @definition
     * Indicates whether the `BlockAdditional` element with `BlockAddID` of "1" contains Alpha data as defined by the Codec Mapping for the `CodecID`.
     *  Undefined values (i.e., values other than 0 or 1) **SHOULD NOT** be used, as the behavior of known implementations is different.
     *
     * @default 0
     * @minver 3
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x53C0
     */
    export enum AlphaMode {
        /**
         * @definition
         * The `BlockAdditional` element with `BlockAddID` of "1" does not exist or **SHOULD NOT** be considered as containing such data.
         *
         */
        None = 0,
        /**
         * @definition
         * The `BlockAdditional` element with `BlockAddID` of "1" contains alpha channel data.
         *
         */
        Present = 1
    }

    /**
     * @definition
     * Bogus `StereoMode` value used in old versions of [@?libmatroska].
     *
     * @usage notes
     * This element **MUST NOT** be used. It was an incorrect value used in libmatroska up to 0.9.0.
     *
     * @maxver 2
     * @maxOccurs 1
     * @id 0x53B9
     */
    export enum OldStereoMode {
        /**
         */
        Mono = 0,
        /**
         */
        RightEye = 1,
        /**
         */
        LeftEye = 2,
        /**
         */
        BothEyes = 3
    }

    /**
     * @definition
     * Width of the encoded video frames in pixels.
     *
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xB0
     */
    export type PixelWidth = number;

    /**
     * @definition
     * Height of the encoded video frames in pixels.
     *
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xBA
     */
    export type PixelHeight = number;

    /**
     * @definition
     * The number of video pixels to remove at the bottom of the image.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x54AA
     */
    export type PixelCropBottom = number;

    /**
     * @definition
     * The number of video pixels to remove at the top of the image.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x54BB
     */
    export type PixelCropTop = number;

    /**
     * @definition
     * The number of video pixels to remove on the left of the image.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x54CC
     */
    export type PixelCropLeft = number;

    /**
     * @definition
     * The number of video pixels to remove on the right of the image.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x54DD
     */
    export type PixelCropRight = number;

    /**
     * @definition
     * Width of the video frames to display. Applies to the video frame after cropping (PixelCrop* Elements).
     *
     * @range not 0
     * @maxOccurs 1
     * @id 0x54B0
     */
    export type DisplayWidth = number;

    /**
     * @definition
     * Height of the video frames to display. Applies to the video frame after cropping (PixelCrop* Elements).
     *
     * @range not 0
     * @maxOccurs 1
     * @id 0x54BA
     */
    export type DisplayHeight = number;

    /**
     * @definition
     * How `DisplayWidth` and `DisplayHeight` are interpreted.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x54B2
     */
    export enum DisplayUnit {
        /**
         */
        Pixels = 0,
        /**
         */
        Centimeters = 1,
        /**
         */
        Inches = 2,
        /**
         */
        DisplayAspectRatio = 3,
        /**
         */
        Unknown = 4
    }

    /**
     * @definition
     * Specifies the possible modifications to the aspect ratio.
     *
     * @default 0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x54B3
     */
    export enum AspectRatioType {
        /**
         */
        FreeResizing = 0,
        /**
         */
        KeepAspectRatio = 1,
        /**
         */
        Fixed = 2
    }

    /**
     * @definition
     * Specifies the uncompressed pixel format used for the `Track`'s data as a FourCC.
     * This value is similar in scope to the biCompression value of AVI's `BITMAPINFO` [@?AVIFormat]. There is neither a definitive list of FourCC values nor an official registry. Some common values for YUV pixel formats can be found at [@?MSYUV8], [@?MSYUV16], and [@?FourCC-YUV]. Some common values for uncompressed RGB pixel formats can be found at [@?MSRGB] and [@?FourCC-RGB].
     *
     * @maxOccurs 1
     * @id 0x2EB524
     */
    export type UncompressedFourCC = ArrayBuffer;

    /**
     * @definition
     * Gamma value.
     *
     * @range > 0x0p+0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x2FB523
     */
    export type GammaValue = number;

    /**
     * @definition
     * Number of frames per second. This value is informational only. It is intended for constant frame rate streams and should not be used for a variable frame rate `TrackEntry`.
     *
     * @range > 0x0p+0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x2383E3
     */
    export type FrameRate = number;

    /**
     * @definition
     * Settings describing the color format.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x55B0
     */
    export interface Colour {
        MatrixCoefficients?: MatrixCoefficients;
        BitsPerChannel?: BitsPerChannel;
        ChromaSubsamplingHorz?: ChromaSubsamplingHorz;
        ChromaSubsamplingVert?: ChromaSubsamplingVert;
        CbSubsamplingHorz?: CbSubsamplingHorz;
        CbSubsamplingVert?: CbSubsamplingVert;
        ChromaSitingHorz?: ChromaSitingHorz;
        ChromaSitingVert?: ChromaSitingVert;
        Range?: Range;
        TransferCharacteristics?: TransferCharacteristics;
        Primaries?: Primaries;
        MaxCLL?: MaxCLL;
        MaxFALL?: MaxFALL;
        MasteringMetadata?: MasteringMetadata;
    }

    /**
     * @definition
     * The Matrix Coefficients of the video used to derive luma and chroma values from red, green, and blue color primaries.
     * For clarity, the value and meanings for `MatrixCoefficients` are adopted from Table 4 of [@!ITU-H.273].
     *
     * @default 2
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x55B1
     */
    export enum MatrixCoefficients {
        /**
         */
        Identity = 0,
        /**
         */
        ItuRBt_709 = 1,
        /**
         */
        Unspecified = 2,
        /**
         */
        Reserved = 3,
        /**
         */
        UsFcc_73_682 = 4,
        /**
         */
        ItuRBt_470Bg = 5,
        /**
         */
        Smpte_170M = 6,
        /**
         */
        Smpte_240M = 7,
        /**
         */
        YCoCg = 8,
        /**
         */
        Bt2020NonConstantLuminance = 9,
        /**
         */
        Bt2020ConstantLuminance = 10,
        /**
         */
        SmpteSt_2085 = 11,
        /**
         */
        ChromaDerivedNonConstantLuminance = 12,
        /**
         */
        ChromaDerivedConstantLuminance = 13,
        /**
         */
        ItuRBt_2100_0 = 14
    }

    /**
     * @definition
     * Number of decoded bits per channel. A value of 0 indicates that the `BitsPerChannel` is unspecified.
     *
     * @default 0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x55B2
     */
    export type BitsPerChannel = number;

    /**
     * @definition
     * The number of pixels to remove in the Cr and Cb channels for every pixel not removed horizontally.
     * Example: For video with 4:2:0 chroma subsampling, the `ChromaSubsamplingHorz` **SHOULD** be set to 1.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x55B3
     */
    export type ChromaSubsamplingHorz = number;

    /**
     * @definition
     * The number of pixels to remove in the Cr and Cb channels for every pixel not removed vertically.
     * Example: For video with 4:2:0 chroma subsampling, the `ChromaSubsamplingVert` **SHOULD** be set to 1.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x55B4
     */
    export type ChromaSubsamplingVert = number;

    /**
     * @definition
     * The number of pixels to remove in the Cb channel for every pixel not removed horizontally.
     * This is additive with `ChromaSubsamplingHorz`. Example: For video with 4:2:1 chroma subsampling,
     * the `ChromaSubsamplingHorz` **SHOULD** be set to 1, and `CbSubsamplingHorz` **SHOULD** be set to 1.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x55B5
     */
    export type CbSubsamplingHorz = number;

    /**
     * @definition
     * The number of pixels to remove in the Cb channel for every pixel not removed vertically.
     * This is additive with `ChromaSubsamplingVert`.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x55B6
     */
    export type CbSubsamplingVert = number;

    /**
     * @definition
     * How chroma is subsampled horizontally.
     *
     * @default 0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x55B7
     */
    export enum ChromaSitingHorz {
        /**
         */
        Unspecified = 0,
        /**
         */
        LeftCollocated = 1,
        /**
         */
        Half = 2
    }

    /**
     * @definition
     * How chroma is subsampled vertically.
     *
     * @default 0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x55B8
     */
    export enum ChromaSitingVert {
        /**
         */
        Unspecified = 0,
        /**
         */
        TopCollocated = 1,
        /**
         */
        Half = 2
    }

    /**
     * @definition
     * Clipping of the color ranges.
     *
     * @default 0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x55B9
     */
    export enum Range {
        /**
         */
        Unspecified = 0,
        /**
         */
        BroadcastRange = 1,
        /**
         */
        FullRangeNoClipping = 2,
        /**
         */
        DefinedByMatrixCoefficientsTransferCharacteristics = 3
    }

    /**
     * @definition
     * The transfer characteristics of the video. For clarity,
     * the value and meanings for `TransferCharacteristics` are adopted from Table 3 of [@!ITU-H.273].
     *
     * @default 2
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x55BA
     */
    export enum TransferCharacteristics {
        /**
         */
        Reserved = 0,
        /**
         */
        ItuRBt_709 = 1,
        /**
         */
        Unspecified = 2,
        /**
         */
        Reserved2 = 3,
        /**
         */
        Gamma_2_2CurveBt_470M = 4,
        /**
         */
        Gamma_2_8CurveBt_470Bg = 5,
        /**
         */
        Smpte_170M = 6,
        /**
         */
        Smpte_240M = 7,
        /**
         */
        Linear = 8,
        /**
         */
        Log = 9,
        /**
         */
        LogSqrt = 10,
        /**
         */
        Iec_61966_2_4 = 11,
        /**
         */
        ItuRBt_1361ExtendedColourGamut = 12,
        /**
         */
        Iec_61966_2_1 = 13,
        /**
         */
        ItuRBt_2020_10Bit = 14,
        /**
         */
        ItuRBt_2020_12Bit = 15,
        /**
         */
        ItuRBt_2100PerceptualQuantization = 16,
        /**
         */
        SmpteSt_428_1 = 17,
        /**
         */
        AribStdB67Hlg = 18
    }

    /**
     * @definition
     * The color primaries of the video. For clarity,
     * the value and meanings for `Primaries` are adopted from Table 2 of [@!ITU-H.273].
     *
     * @default 2
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x55BB
     */
    export enum Primaries {
        /**
         */
        Reserved = 0,
        /**
         */
        ItuRBt_709 = 1,
        /**
         */
        Unspecified = 2,
        /**
         */
        Reserved2 = 3,
        /**
         */
        ItuRBt_470M = 4,
        /**
         */
        ItuRBt_470BgBt_601_625 = 5,
        /**
         */
        ItuRBt_601_525Smpte_170M = 6,
        /**
         */
        Smpte_240M = 7,
        /**
         */
        Film = 8,
        /**
         */
        ItuRBt_2020 = 9,
        /**
         */
        SmpteSt_428_1 = 10,
        /**
         */
        SmpteRp_432_2 = 11,
        /**
         */
        SmpteEg_432_2 = 12,
        /**
         */
        EbuTech_3213EJedecP22Phosphors = 22
    }

    /**
     * @definition
     * Maximum brightness of a single pixel (Maximum Content Light Level)
     * in candelas per square meter (cd/m^2^).
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x55BC
     */
    export type MaxCLL = number;

    /**
     * @definition
     * Maximum brightness of a single full frame (Maximum Frame-Average Light Level)
     * in candelas per square meter (cd/m^2^).
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x55BD
     */
    export type MaxFALL = number;

    /**
     * @definition
     * SMPTE 2086 mastering data.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x55D0
     */
    export interface MasteringMetadata {
        PrimaryRChromaticityX?: PrimaryRChromaticityX;
        PrimaryRChromaticityY?: PrimaryRChromaticityY;
        PrimaryGChromaticityX?: PrimaryGChromaticityX;
        PrimaryGChromaticityY?: PrimaryGChromaticityY;
        PrimaryBChromaticityX?: PrimaryBChromaticityX;
        PrimaryBChromaticityY?: PrimaryBChromaticityY;
        WhitePointChromaticityX?: WhitePointChromaticityX;
        WhitePointChromaticityY?: WhitePointChromaticityY;
        LuminanceMax?: LuminanceMax;
        LuminanceMin?: LuminanceMin;
    }

    /**
     * @definition
     * Red X chromaticity coordinate, as defined by [@!CIE-1931].
     *
     * @range 0x0p+0-0x1p+0
     * @minver 4
     * @maxOccurs 1
     * @id 0x55D1
     */
    export type PrimaryRChromaticityX = number;

    /**
     * @definition
     * Red Y chromaticity coordinate, as defined by [@!CIE-1931].
     *
     * @range 0x0p+0-0x1p+0
     * @minver 4
     * @maxOccurs 1
     * @id 0x55D2
     */
    export type PrimaryRChromaticityY = number;

    /**
     * @definition
     * Green X chromaticity coordinate, as defined by [@!CIE-1931].
     *
     * @range 0x0p+0-0x1p+0
     * @minver 4
     * @maxOccurs 1
     * @id 0x55D3
     */
    export type PrimaryGChromaticityX = number;

    /**
     * @definition
     * Green Y chromaticity coordinate, as defined by [@!CIE-1931].
     *
     * @range 0x0p+0-0x1p+0
     * @minver 4
     * @maxOccurs 1
     * @id 0x55D4
     */
    export type PrimaryGChromaticityY = number;

    /**
     * @definition
     * Blue X chromaticity coordinate, as defined by [@!CIE-1931].
     *
     * @range 0x0p+0-0x1p+0
     * @minver 4
     * @maxOccurs 1
     * @id 0x55D5
     */
    export type PrimaryBChromaticityX = number;

    /**
     * @definition
     * Blue Y chromaticity coordinate, as defined by [@!CIE-1931].
     *
     * @range 0x0p+0-0x1p+0
     * @minver 4
     * @maxOccurs 1
     * @id 0x55D6
     */
    export type PrimaryBChromaticityY = number;

    /**
     * @definition
     * White X chromaticity coordinate, as defined by [@!CIE-1931].
     *
     * @range 0x0p+0-0x1p+0
     * @minver 4
     * @maxOccurs 1
     * @id 0x55D7
     */
    export type WhitePointChromaticityX = number;

    /**
     * @definition
     * White Y chromaticity coordinate, as defined by [@!CIE-1931].
     *
     * @range 0x0p+0-0x1p+0
     * @minver 4
     * @maxOccurs 1
     * @id 0x55D8
     */
    export type WhitePointChromaticityY = number;

    /**
     * @definition
     * Maximum luminance. Represented in candelas per square meter (cd/m^2^).
     *
     * @range >= 0x0p+0
     * @minver 4
     * @maxOccurs 1
     * @id 0x55D9
     */
    export type LuminanceMax = number;

    /**
     * @definition
     * Minimum luminance. Represented in candelas per square meter (cd/m^2^).
     *
     * @range >= 0x0p+0
     * @minver 4
     * @maxOccurs 1
     * @id 0x55DA
     */
    export type LuminanceMin = number;

    /**
     * @definition
     * Describes the video projection details. Used to render spherical or VR videos or to flip videos horizontally or vertically.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x7670
     */
    export interface Projection {
        ProjectionType?: ProjectionType;
        ProjectionPrivate?: ProjectionPrivate;
        ProjectionPoseYaw?: ProjectionPoseYaw;
        ProjectionPosePitch?: ProjectionPosePitch;
        ProjectionPoseRoll?: ProjectionPoseRoll;
    }

    /**
     * @definition
     * Describes the projection used for this video track.
     *
     * @default 0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x7671
     */
    export enum ProjectionType {
        /**
         */
        Rectangular = 0,
        /**
         */
        Equirectangular = 1,
        /**
         */
        Cubemap = 2,
        /**
         */
        Mesh = 3
    }

    /**
     * @definition
     * Private data that only applies to a specific projection.
     * *  If `ProjectionType` equals 0 (rectangular),
     *      then this element **MUST NOT** be present.
     * *  If `ProjectionType` equals 1 (equirectangular), then this element **MUST** be present and contain the same binary data that would be stored inside
     *       an ISOBMFF Equirectangular Projection Box ("equi").
     * *  If `ProjectionType` equals 2 (cubemap), then this element **MUST** be present and contain the same binary data that would be stored
     *       inside an ISOBMFF Cubemap Projection Box ("cbmp").
     * *  If `ProjectionType` equals 3 (mesh), then this element **MUST** be present and contain the same binary data that would be stored inside
     *        an ISOBMFF Mesh Projection Box ("mshp").
     *
     * @usage notes
     * ISOBMFF box size and FourCC fields are not included in the binary data,
     * but the FullBox version and flag fields are. This is to avoid
     * redundant framing information while preserving versioning and semantics between the two container formats.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x7672
     */
    export type ProjectionPrivate = ArrayBuffer;

    /**
     * @definition
     * Specifies a yaw rotation to the projection.
     *
     * Value represents a clockwise rotation, in degrees, around the up vector. This rotation must be applied
     * before any `ProjectionPosePitch` or `ProjectionPoseRoll` rotations.
     * The value of this element **MUST** be in the -180 to 180 degree range, both inclusive.
     *
     * Setting `ProjectionPoseYaw` to 180 or -180 degrees with `ProjectionPoseRoll` and `ProjectionPosePitch` set to 0 degrees flips the image horizontally.
     *
     * @default 0x0p+0
     * @range >= -0xB4p+0, <= 0xB4p+0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x7673
     */
    export type ProjectionPoseYaw = number;

    /**
     * @definition
     * Specifies a pitch rotation to the projection.
     *
     * Value represents a counter-clockwise rotation, in degrees, around the right vector. This rotation must be applied
     * after the `ProjectionPoseYaw` rotation and before the `ProjectionPoseRoll` rotation.
     * The value of this element **MUST** be in the -90 to 90 degree range, both inclusive.
     *
     * @default 0x0p+0
     * @range >= -0x5Ap+0, <= 0x5Ap+0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x7674
     */
    export type ProjectionPosePitch = number;

    /**
     * @definition
     * Specifies a roll rotation to the projection.
     *
     * Value represents a counter-clockwise rotation, in degrees, around the forward vector. This rotation must be applied
     * after the `ProjectionPoseYaw` and `ProjectionPosePitch` rotations.
     * The value of this element **MUST** be in the -180 to 180 degree range, both inclusive.
     *
     * Setting `ProjectionPoseRoll` to 180 or -180 degrees and `ProjectionPoseYaw` to 180 or -180 degrees with `ProjectionPosePitch` set to 0 degrees flips the image vertically.
     *
     * Setting `ProjectionPoseRoll` to 180 or -180 degrees with `ProjectionPoseYaw` and `ProjectionPosePitch` set to 0 degrees flips the image horizontally and vertically.
     *
     * @default 0x0p+0
     * @range >= -0xB4p+0, <= 0xB4p+0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x7675
     */
    export type ProjectionPoseRoll = number;

    /**
     * @definition
     * Audio settings.
     *
     * @maxOccurs 1
     * @id 0xE1
     */
    export interface Audio {
        SamplingFrequency: SamplingFrequency;
        OutputSamplingFrequency?: OutputSamplingFrequency;
        Channels: Channels;
        ChannelPositions?: ChannelPositions;
        BitDepth?: BitDepth;
        Emphasis?: Emphasis;
    }

    /**
     * @definition
     * Sampling frequency in Hz.
     *
     * @default 0x1.f4p+12
     * @range > 0x0p+0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xB5
     */
    export type SamplingFrequency = number;

    /**
     * @definition
     * Real output sampling frequency in Hz that is used for Spectral Band Replication (SBR) techniques.
     *
     * @range > 0x0p+0
     * @maxOccurs 1
     * @id 0x78B5
     */
    export type OutputSamplingFrequency = number;

    /**
     * @definition
     * Numbers of channels in the track.
     *
     * @default 1
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x9F
     */
    export type Channels = number;

    /**
     * @definition
     * Table of horizontal angles for each successive channel.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x7D7B
     */
    export type ChannelPositions = ArrayBuffer;

    /**
     * @definition
     * Bits per sample, mostly used for PCM.
     *
     * @range not 0
     * @maxOccurs 1
     * @id 0x6264
     */
    export type BitDepth = number;

    /**
     * @definition
     * Audio emphasis applied on audio samples. The player **MUST** apply the inverse emphasis to get the proper audio samples.
     *
     * @default 0
     * @minver 5
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x52F1
     */
    export enum Emphasis {
        /**
         */
        NoEmphasis = 0,
        /**
         * @definition
         * First order filter with zero point at 50 microseconds and a pole at 15 microseconds. Also found on DVD Audio and MPEG audio.
         *
         */
        CdAudio = 1,
        /**
         */
        Reserved = 2,
        /**
         * @definition
         * Defined in [@!ITU-J.17].
         *
         */
        CcitJ_17 = 3,
        /**
         * @definition
         * FM Radio in Europe. RC Filter with a time constant of 50 microseconds.
         *
         */
        Fm_50 = 4,
        /**
         * @definition
         * FM Radio in the USA. RC Filter with a time constant of 75 microseconds.
         *
         */
        Fm_75 = 5,
        /**
         * @definition
         * Phono filter with time constants of t1=3180, t2=318 and t3=75 microseconds. [@!NAB1964]
         *
         */
        PhonoRiaa = 10,
        /**
         * @definition
         * Phono filter with time constants of t1=3180, t2=450 and t3=50 microseconds.
         *
         */
        PhonoIecN78 = 11,
        /**
         * @definition
         * Phono filter with time constants of t1=3180, t2=318 and t3=50 microseconds.
         *
         */
        PhonoTeldec = 12,
        /**
         * @definition
         * Phono filter with time constants of t1=2500, t2=500 and t3=70 microseconds.
         *
         */
        PhonoEmi = 13,
        /**
         * @definition
         * Phono filter with time constants of t1=1590, t2=318 and t3=100 microseconds.
         *
         */
        PhonoColumbiaLp = 14,
        /**
         * @definition
         * Phono filter with time constants of t1=1590, t2=318 and t3=50 microseconds.
         *
         */
        PhonoLondon = 15,
        /**
         * @definition
         * Phono filter with time constants of t1=3180, t2=318 and t3=100 microseconds.
         *
         */
        PhonoNartb = 16
    }

    /**
     * @definition
     * Operation that needs to be applied on tracks to create this virtual track.
     * For more details, see (#track-operation).
     *
     * @minver 3
     * @maxOccurs 1
     * @id 0xE2
     */
    export interface TrackOperation {
        TrackCombinePlanes?: TrackCombinePlanes;
        TrackJoinBlocks?: TrackJoinBlocks;
    }

    /**
     * @definition
     * Contains the list of all video plane tracks that need to be combined to create this 3D track.
     *
     * @minver 3
     * @maxOccurs 1
     * @id 0xE3
     */
    export interface TrackCombinePlanes {
        TrackPlane?: TrackPlane[];
    }

    /**
     * @definition
     * Contains a video plane track that needs to be combined to create this 3D track.
     *
     * @minver 3
     * @minOccurs 1
     * @id 0xE4
     */
    export interface TrackPlane {
        TrackPlaneUID?: TrackPlaneUID;
        TrackPlaneType?: TrackPlaneType;
    }

    /**
     * @definition
     * The `TrackUID` number of the track representing the plane.
     *
     * @range not 0
     * @minver 3
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xE5
     */
    export type TrackPlaneUID = number;

    /**
     * @definition
     * The kind of plane this track corresponds to.
     *
     * @minver 3
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xE6
     */
    export enum TrackPlaneType {
        /**
         */
        LeftEye = 0,
        /**
         */
        RightEye = 1,
        /**
         */
        Background = 2
    }

    /**
     * @definition
     * Contains the list of all tracks whose `Blocks` need to be combined to create this virtual track.
     *
     * @minver 3
     * @maxOccurs 1
     * @id 0xE9
     */
    export interface TrackJoinBlocks {
        TrackJoinUID?: TrackJoinUID[];
    }

    /**
     * @definition
     * The `TrackUID` number of a track whose blocks are used to create this virtual track.
     *
     * @range not 0
     * @minver 3
     * @minOccurs 1
     * @id 0xED
     */
    export type TrackJoinUID = number;

    /**
     * @definition
     * The `TrackUID` of the Smooth FF/RW video in the paired EBML structure corresponding to this video track. See [@?DivXTrickTrack].
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xC0
     */
    export type TrickTrackUID = number;

    /**
     * @definition
     * The `SegmentUUID` of the `Segment` containing the track identified by TrickTrackUID. See [@?DivXTrickTrack].
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xC1
     */
    export type TrickTrackSegmentUID = ArrayBuffer;

    /**
     * @definition
     * Set to 1 if this video track is a Smooth FF/RW track. If set to 1, `MasterTrackUID` and `MasterTrackSegUID` should be present, and `BlockGroups` for this track must contain ReferenceFrame structures.
     * Otherwise, TrickTrackUID and TrickTrackSegUID must be present if this track has a corresponding Smooth FF/RW track. See [@?DivXTrickTrack].
     *
     * @default 0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xC6
     */
    export type TrickTrackFlag = number;

    /**
     * @definition
     * The `TrackUID` of the video track in the paired EBML structure that corresponds to this Smooth FF/RW track. See [@?DivXTrickTrack].
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xC7
     */
    export type TrickMasterTrackUID = number;

    /**
     * @definition
     * The `SegmentUUID` of the `Segment` containing the track identified by MasterTrackUID. See [@?DivXTrickTrack].
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xC4
     */
    export type TrickMasterTrackSegmentUID = ArrayBuffer;

    /**
     * @definition
     * Settings for several content encoding mechanisms like compression or encryption.
     *
     * @maxOccurs 1
     * @id 0x6D80
     */
    export interface ContentEncodings {
        ContentEncoding: ContentEncoding[];
    }

    /**
     * @definition
     * Settings for one content encoding like compression or encryption.
     *
     * @minOccurs 1
     * @id 0x6240
     */
    export interface ContentEncoding {
        ContentEncodingOrder: ContentEncodingOrder;
        ContentEncodingScope: ContentEncodingScope;
        ContentEncodingType: ContentEncodingType;
        ContentCompression?: ContentCompression;
        ContentEncryption?: ContentEncryption;
    }

    /**
     * @definition
     * Defines the order to apply each `ContentEncoding` of the `ContentEncodings`.
     * The decoder/demuxer **MUST** start with the `ContentEncoding` with the highest `ContentEncodingOrder` and work its way down to the `ContentEncoding` with the lowest `ContentEncodingOrder`.
     * This value **MUST** be unique for each `ContentEncoding` found in the `ContentEncodings` of this `TrackEntry`.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x5031
     */
    export type ContentEncodingOrder = number;

    /**
     * @definition
     * A bit field that describes which elements have been modified in this way.
     * Values (big-endian) can be OR'ed.
     *
     * @default 1
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x5032
     */
    export enum ContentEncodingScope {
        /**
         * @definition
         * All frame contents, excluding lacing data.
         *
         */
        Block = 0x1,
        /**
         * @definition
         * The track's `CodecPrivate` data.
         *
         */
        Private = 0x2,
        /**
         * @definition
         * The next ContentEncoding (next `ContentEncodingOrder`; the data inside `ContentCompression` and/or `ContentEncryption`).
         *
         * @usage notes
         * This value **SHOULD NOT** be used, as it's not supported by players.
         *
         */
        Next = 0x4
    }

    /**
     * @definition
     * A value describing the kind of transformation that is applied.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x5033
     */
    export enum ContentEncodingType {
        /**
         */
        Compression = 0,
        /**
         */
        Encryption = 1
    }

    /**
     * @definition
     * Settings describing the compression used.
     * This element **MUST** be present if the value of `ContentEncodingType` is 0 and absent otherwise.
     * Each block **MUST** be decompressable, even if no previous block is available in order to not prevent seeking.
     *
     * @maxOccurs 1
     * @id 0x5034
     */
    export interface ContentCompression {
        ContentCompAlgo: ContentCompAlgo;
        ContentCompSettings?: ContentCompSettings;
    }

    /**
     * @definition
     * The compression algorithm used.
     *
     * @usage notes
     * Compression method "1" (bzlib) and "2" (lzo1x) lack proper documentation on the format, which limits implementation possibilities.
     * Due to licensing conflicts on commonly available libraries' compression methods, "2" (lzo1x) does not offer widespread interoperability.
     * A `Matroska Writer` **SHOULD NOT** use these compression methods by default.
     * A `Matroska Reader` **MAY** support methods "1" and "2" and **SHOULD** support other methods.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x4254
     */
    export enum ContentCompAlgo {
        /**
         * @definition
         * zlib compression [@!RFC1950].
         *
         */
        Zlib = 0,
        /**
         * @definition
         * bzip2 compression [@?BZIP2] **SHOULD NOT** be used; see usage notes.
         *
         */
        Bzlib = 1,
        /**
         * @definition
         * Lempel-Ziv-Oberhumer compression [@?LZO] **SHOULD NOT** be used; see usage notes.
         *
         */
        Lzo1x = 2,
        /**
         * @definition
         * Octets in `ContentCompSettings` ((#contentcompsettings-element)) have been stripped from each frame.
         *
         */
        HeaderStripping = 3
    }

    /**
     * @definition
     * Settings that might be needed by the decompressor. For Header Stripping (`ContentCompAlgo`=3),
     * the bytes that were removed from the beginning of each frame of the track.
     *
     * @maxOccurs 1
     * @id 0x4255
     */
    export type ContentCompSettings = ArrayBuffer;

    /**
     * @definition
     * Settings describing the encryption used.
     * This element **MUST** be present if the value of `ContentEncodingType` is 1 (encryption) and **MUST** be ignored otherwise.
     * A `Matroska Player` **MAY** support encryption.
     *
     * @maxOccurs 1
     * @id 0x5035
     */
    export interface ContentEncryption {
        ContentEncAlgo: ContentEncAlgo;
        ContentEncKeyID?: ContentEncKeyID;
        ContentEncAESSettings?: ContentEncAESSettings;
        ContentSignature?: ContentSignature;
        ContentSigKeyID?: ContentSigKeyID;
        ContentSigAlgo?: ContentSigAlgo;
        ContentSigHashAlgo?: ContentSigHashAlgo;
    }

    /**
     * @definition
     * The encryption algorithm used.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x47E1
     */
    export enum ContentEncAlgo {
        /**
         * @definition
         * The data are not encrypted.
         *
         */
        NotEncrypted = 0,
        /**
         * @definition
         * Data Encryption Standard (DES) [@?FIPS46-3].
         *
         * @usage notes
         * This value **SHOULD** be avoided.
         *
         */
        Des = 1,
        /**
         * @definition
         * Triple Data Encryption Algorithm [@?SP800-67].
         *
         * @usage notes
         * This value **SHOULD** be avoided.
         *
         */
        '3Des' = 2,
        /**
         * @definition
         * Twofish Encryption Algorithm [@?Twofish].
         *
         */
        Twofish = 3,
        /**
         * @definition
         * Blowfish Encryption Algorithm [@?Blowfish].
         *
         * @usage notes
         * This value **SHOULD** be avoided.
         *
         */
        Blowfish = 4,
        /**
         * @definition
         * Advanced Encryption Standard (AES) [@?FIPS197].
         *
         */
        Aes = 5
    }

    /**
     * @definition
     * For public key algorithms, the ID of the public key that the data was encrypted with.
     *
     * @maxOccurs 1
     * @id 0x47E2
     */
    export type ContentEncKeyID = ArrayBuffer;

    /**
     * @definition
     * Settings describing the encryption algorithm used.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x47E7
     */
    export interface ContentEncAESSettings {
        AESSettingsCipherMode?: AESSettingsCipherMode;
    }

    /**
     * @definition
     * The AES cipher mode used in the encryption.
     *
     * @range not 0
     * @minver 4
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x47E8
     */
    export enum AESSettingsCipherMode {
        /**
         * @definition
         * Counter [@?SP800-38A]
         *
         */
        AesCtr = 1,
        /**
         * @definition
         * Cipher Block Chaining [@?SP800-38A]
         *
         */
        AesCbc = 2
    }

    /**
     * @definition
     * A cryptographic signature of the contents.
     *
     * @maxver 0
     * @maxOccurs 1
     * @id 0x47E3
     */
    export type ContentSignature = ArrayBuffer;

    /**
     * @definition
     * This is the ID of the private key that the data was signed with.
     *
     * @maxver 0
     * @maxOccurs 1
     * @id 0x47E4
     */
    export type ContentSigKeyID = ArrayBuffer;

    /**
     * @definition
     * The algorithm used for the signature.
     *
     * @default 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x47E5
     */
    export enum ContentSigAlgo {
        /**
         */
        NotSigned = 0,
        /**
         */
        Rsa = 1
    }

    /**
     * @definition
     * The hash algorithm used for the signature.
     *
     * @default 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x47E6
     */
    export enum ContentSigHashAlgo {
        /**
         */
        NotSigned = 0,
        /**
         */
        Sha1_160 = 1,
        /**
         */
        Md5 = 2
    }

    /**
     * @definition
     * A `Top-Level Element` to speed seeking access.
     * All entries are local to the `Segment`.
     *
     * @maxOccurs 1
     * @id 0x1C53BB6B
     */
    export interface Cues {
        CuePoint: CuePoint[];
    }

    /**
     * @definition
     * Contains all information relative to a seek point in the `Segment`.
     *
     * @minOccurs 1
     * @id 0xBB
     */
    export interface CuePoint {
        CueTime: CueTime;
        CueTrackPositions: CueTrackPositions[];
    }

    /**
     * @definition
     * Absolute timestamp of the seek point, expressed in Segment Ticks, which are based on `TimestampScale`; see (#timestamp-ticks).
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xB3
     */
    export type CueTime = number;

    /**
     * @definition
     * Contains positions for different tracks corresponding to the timestamp.
     *
     * @minOccurs 1
     * @id 0xB7
     */
    export interface CueTrackPositions {
        CueTrack: CueTrack;
        CueClusterPosition: CueClusterPosition;
        CueRelativePosition?: CueRelativePosition;
        CueDuration?: CueDuration;
        CueBlockNumber?: CueBlockNumber;
        CueCodecState?: CueCodecState;
        CueReference?: CueReference[];
    }

    /**
     * @definition
     * The track for which a position is given.
     *
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xF7
     */
    export type CueTrack = number;

    /**
     * @definition
     * The `Segment Position` ((#segment-position)) of the `Cluster` containing the associated `Block`.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xF1
     */
    export type CueClusterPosition = number;

    /**
     * @definition
     * The relative position inside the `Cluster` of the referenced `SimpleBlock` or `BlockGroup`
     * with 0 being the first possible position for an element inside that `Cluster`.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0xF0
     */
    export type CueRelativePosition = number;

    /**
     * @definition
     * The duration of the block, expressed in Segment Ticks, which are based on `TimestampScale`; see (#timestamp-ticks).
     * If missing, the track's `DefaultDuration` does not apply and no duration information is available in terms of the cues.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0xB2
     */
    export type CueDuration = number;

    /**
     * @definition
     * Number of the `Block` in the specified `Cluster`.
     *
     * @range not 0
     * @maxOccurs 1
     * @id 0x5378
     */
    export type CueBlockNumber = number;

    /**
     * @definition
     * The `Segment Position` ((#segment-position)) of the Codec State corresponding to this `Cues` element.
     * 0 means that the data is taken from the initial `TrackEntry`.
     *
     * @default 0
     * @minver 2
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0xEA
     */
    export type CueCodecState = number;

    /**
     * @definition
     * The `Clusters` containing the referenced `Blocks`.
     *
     * @minver 2
     * @id 0xDB
     */
    export interface CueReference {
        CueRefTime?: CueRefTime;
        CueRefCluster?: CueRefCluster;
        CueRefNumber?: CueRefNumber;
        CueRefCodecState?: CueRefCodecState;
    }

    /**
     * @definition
     * Timestamp of the referenced `Block`, expressed in Segment Ticks which is based on `TimestampScale`; see (#timestamp-ticks).
     *
     * @minver 2
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x96
     */
    export type CueRefTime = number;

    /**
     * @definition
     * The `Segment Position` of the `Cluster` containing the referenced `Block`.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x97
     */
    export type CueRefCluster = number;

    /**
     * @definition
     * Number of the referenced `Block` of Track X in the specified `Cluster`.
     *
     * @default 1
     * @range not 0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x535F
     */
    export type CueRefNumber = number;

    /**
     * @definition
     * The `Segment Position` of the Codec State corresponding to this referenced element.
     * 0 means that the data is taken from the initial `TrackEntry`.
     *
     * @default 0
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0xEB
     */
    export type CueRefCodecState = number;

    /**
     * @definition
     * Contains attached files.
     *
     * @maxOccurs 1
     * @id 0x1941A469
     */
    export interface Attachments {
        AttachedFile: AttachedFile[];
    }

    /**
     * @definition
     * An attached file.
     *
     * @minOccurs 1
     * @id 0x61A7
     */
    export interface AttachedFile {
        FileDescription?: FileDescription;
        FileName: FileName;
        FileMediaType: FileMediaType;
        FileData: FileData;
        FileUID: FileUID;
        FileReferral?: FileReferral;
        FileUsedStartTime?: FileUsedStartTime;
        FileUsedEndTime?: FileUsedEndTime;
    }

    /**
     * @definition
     * A human-friendly name for the attached file.
     *
     * @maxOccurs 1
     * @id 0x467E
     */
    export type FileDescription = string;

    /**
     * @definition
     * Filename of the attached file.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x466E
     */
    export type FileName = string;

    /**
     * @definition
     * Media type of the file following the format described in [@!RFC6838].
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x4660
     */
    export type FileMediaType = string;

    /**
     * @definition
     * The data of the file.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x465C
     */
    export type FileData = ArrayBuffer;

    /**
     * @definition
     * UID representing the file, as random as possible.
     *
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x46AE
     */
    export type FileUID = number;

    /**
     * @definition
     * A binary value that a track/codec can refer to when the attachment is needed.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x4675
     */
    export type FileReferral = ArrayBuffer;

    /**
     * @definition
     * The timestamp at which this optimized font attachment comes into context, expressed in Segment Ticks, which are based on `TimestampScale`. See [@?DivXWorldFonts].
     *
     * @usage notes
     * This element is reserved for future use and if written **MUST** be the segment start timestamp.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x4661
     */
    export type FileUsedStartTime = number;

    /**
     * @definition
     * The timestamp at which this optimized font attachment goes out of context, expressed in Segment Ticks, which are based on `TimestampScale`. See [@?DivXWorldFonts].
     *
     * @usage notes
     * This element is reserved for future use and if written **MUST** be the segment end timestamp.
     *
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @id 0x4662
     */
    export type FileUsedEndTime = number;

    /**
     * @definition
     * A system to define basic menus and partition data.
     * For more detailed information, see (#chapters).
     *
     * @maxOccurs 1
     * @id 0x1043A770
     */
    export interface Chapters {
        EditionEntry: EditionEntry[];
    }

    /**
     * @definition
     * Contains all information about a `Segment` edition.
     *
     * @minOccurs 1
     * @id 0x45B9
     */
    export interface EditionEntry {
        EditionUID?: EditionUID;
        EditionFlagHidden: EditionFlagHidden;
        EditionFlagDefault: EditionFlagDefault;
        EditionFlagOrdered: EditionFlagOrdered;
        EditionDisplay?: EditionDisplay[];
        ChapterAtom: ChapterAtom[];
    }

    /**
     * @definition
     * A UID that identifies the edition. It's useful for tagging an edition.
     *
     * @range not 0
     * @maxOccurs 1
     * @id 0x45BC
     */
    export type EditionUID = number;

    /**
     * @definition
     * Set to 1 if an edition is hidden. Hidden editions **SHOULD NOT** be available to the user interface
     * (but still be available to Control Tracks; see (#chapter-flags) on `Chapter` flags).
     *
     * @default 0
     * @range 0-1
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x45BD
     */
    export type EditionFlagHidden = number;

    /**
     * @definition
     * Set to 1 if the edition **SHOULD** be used as the default one.
     *
     * @default 0
     * @range 0-1
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x45DB
     */
    export type EditionFlagDefault = number;

    /**
     * @definition
     * Set to 1 if the chapters can be defined multiple times and the order to play them is enforced; see (#editionflagordered).
     *
     * @default 0
     * @range 0-1
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x45DD
     */
    export type EditionFlagOrdered = number;

    /**
     * @definition
     * Contains a possible string to use for the edition display for the given languages.
     *
     * @minver 5
     * @id 0x4520
     */
    export interface EditionDisplay {
        EditionString?: EditionString;
        EditionLanguageIETF?: EditionLanguageIETF[];
    }

    /**
     * @definition
     * Contains the string to use as the edition name.
     *
     * @minver 5
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x4521
     */
    export type EditionString = string;

    /**
     * @definition
     * One language corresponding to the EditionString,
     * in the form defined in [@!RFC5646]; see (#language-codes) on language codes.
     *
     * @minver 5
     * @id 0x45E4
     */
    export type EditionLanguageIETF = string;

    /**
     * @definition
     * Contains the atom information to use as the chapter atom (applies to all tracks).
     *
     * @minOccurs 1
     * @id 0xB6
     */
    export interface ChapterAtom {
        ChapterUID: ChapterUID;
        ChapterStringUID?: ChapterStringUID;
        ChapterTimeStart: ChapterTimeStart;
        ChapterTimeEnd?: ChapterTimeEnd;
        ChapterFlagHidden: ChapterFlagHidden;
        ChapterFlagEnabled: ChapterFlagEnabled;
        ChapterSegmentUUID?: ChapterSegmentUUID;
        ChapterSkipType?: ChapterSkipType;
        ChapterSegmentEditionUID?: ChapterSegmentEditionUID;
        ChapterPhysicalEquiv?: ChapterPhysicalEquiv;
        ChapterTrack?: ChapterTrack;
        ChapterDisplay?: ChapterDisplay[];
        ChapProcess?: ChapProcess[];
    }

    /**
     * @definition
     * A UID that identifies the `Chapter`.
     *
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x73C4
     */
    export type ChapterUID = number;

    /**
     * @definition
     * A unique string ID that identifies the `Chapter`.
     * For example, it is used as the storage for cue identifier values [@?WebVTT].
     *
     * @minver 3
     * @maxOccurs 1
     * @id 0x5654
     */
    export type ChapterStringUID = string;

    /**
     * @definition
     * Timestamp of the start of `Chapter`, expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks).
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x91
     */
    export type ChapterTimeStart = number;

    /**
     * @definition
     * Timestamp of the end of `Chapter` (timestamp excluded), expressed in Matroska Ticks -- i.e., in nanoseconds; see (#timestamp-ticks).
     * The value **MUST** be greater than or equal to the `ChapterTimeStart` of the same `ChapterAtom`.
     *
     * @usage notes
     * With the `ChapterTimeEnd` timestamp value being excluded, it **MUST** take into account the duration of
     * the last frame it includes, especially for the `ChapterAtom` using the last frames of the `Segment`.
     *
     * @maxOccurs 1
     * @id 0x92
     */
    export type ChapterTimeEnd = number;

    /**
     * @definition
     * Set to 1 if a chapter is hidden. Hidden chapters **SHOULD NOT** be available to the user interface
     * (but still be available to Control Tracks; see (#chapterflaghidden) on `Chapter` flags).
     *
     * @default 0
     * @range 0-1
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x98
     */
    export type ChapterFlagHidden = number;

    /**
     * @definition
     * Set to 1 if the chapter is enabled. It can be enabled/disabled by a Control Track.
     * When disabled, the movie **SHOULD** skip all the content between the TimeStart and TimeEnd of this chapter; see (#chapter-flags) on `Chapter` flags.
     *
     * @default 1
     * @range 0-1
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x4598
     */
    export type ChapterFlagEnabled = number;

    /**
     * @definition
     * The `SegmentUUID` of another `Segment` to play during this chapter.
     *
     * @usage notes
     * The value **MUST NOT** be the `SegmentUUID` value of the `Segment` it belongs to.
     *
     * @maxOccurs 1
     * @id 0x6E67
     */
    export type ChapterSegmentUUID = ArrayBuffer;

    /**
     * @definition
     * Indicates what type of content the `ChapterAtom` contains and might be skipped. It can be used to automatically skip content based on the type.
     * If a `ChapterAtom` is inside a `ChapterAtom` that has a `ChapterSkipType` set, it **MUST NOT** have a `ChapterSkipType` or have a `ChapterSkipType` with the same value as it's parent `ChapterAtom`.
     * If the `ChapterAtom` doesn't contain a `ChapterTimeEnd`, the value of the `ChapterSkipType` is only valid until the next `ChapterAtom` with a `ChapterSkipType` value or the end of the file.
     *
     * @minver 5
     * @maxOccurs 1
     * @id 0x4588
     */
    export enum ChapterSkipType {
        /**
         * @definition
         * Content which should not be skipped.
         *
         */
        NoSkipping = 0,
        /**
         * @definition
         * Credits usually found at the beginning of the content.
         *
         */
        OpeningCredits = 1,
        /**
         * @definition
         * Credits usually found at the end of the content.
         *
         */
        EndCredits = 2,
        /**
         * @definition
         * Recap of previous episodes of the content, usually found around the beginning.
         *
         */
        Recap = 3,
        /**
         * @definition
         * Preview of the next episode of the content, usually found around the end. It may contain spoilers the user wants to avoid.
         *
         */
        NextPreview = 4,
        /**
         * @definition
         * Preview of the current episode of the content, usually found around the beginning. It may contain spoilers the user want to avoid.
         *
         */
        Preview = 5,
        /**
         * @definition
         * Advertisement within the content.
         *
         */
        Advertisement = 6
    }

    /**
     * @definition
     * The `EditionUID` to play from the `Segment` linked in `ChapterSegmentUUID`.
     * If `ChapterSegmentEditionUID` is undeclared, then no `Edition` of the `Linked Segment` is used; see (#medium-linking) on Medium-Linking `Segments`.
     *
     * @range not 0
     * @maxOccurs 1
     * @id 0x6EBC
     */
    export type ChapterSegmentEditionUID = number;

    /**
     * @definition
     * Specifies the physical equivalent of this `ChapterAtom`, e.g., "DVD" (60) or "SIDE" (50);
     * see (#physical-types) for a complete list of values.
     *
     * @maxOccurs 1
     * @id 0x63C3
     */
    export type ChapterPhysicalEquiv = number;

    /**
     * @definition
     * List of tracks on which the chapter applies. If this element is not present, all tracks apply.
     *
     * @maxOccurs 1
     * @id 0x8F
     */
    export interface ChapterTrack {
        ChapterTrackUID: ChapterTrackUID[];
    }

    /**
     * @definition
     * UID of the `Track` to apply this chapter to.
     * In the absence of a control track, choosing this chapter will select the listed `Tracks` and deselect unlisted tracks.
     * Absence of this element indicates that the `Chapter` **SHOULD** be applied to any currently used `Tracks`.
     *
     * @range not 0
     * @minOccurs 1
     * @id 0x89
     */
    export type ChapterTrackUID = number;

    /**
     * @definition
     * Contains all possible strings to use for the chapter display.
     *
     * @id 0x80
     */
    export interface ChapterDisplay {
        ChapString: ChapString;
        ChapLanguage: ChapLanguage[];
        ChapLanguageBCP47?: ChapLanguageBCP47[];
        ChapCountry?: ChapCountry[];
    }

    /**
     * @definition
     * Contains the string to use as the chapter atom.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x85
     */
    export type ChapString = string;

    /**
     * @definition
     * A language corresponding to the string,
     * in the Matroska languages form; see (#language-codes) on language codes.
     * This element **MUST** be ignored if a `ChapLanguageBCP47` element is used within the same `ChapterDisplay` element.
     *
     * @default eng
     * @minOccurs 1
     * @id 0x437C
     */
    export type ChapLanguage = string;

    /**
     * @definition
     * A language corresponding to the `ChapString`,
     * in the form defined in [@!RFC5646]; see (#language-codes) on language codes.
     * If a `ChapLanguageBCP47` element is used, then any `ChapLanguage` and `ChapCountry` elements used in the same `ChapterDisplay` **MUST** be ignored.
     *
     * @minver 4
     * @id 0x437D
     */
    export type ChapLanguageBCP47 = string;

    /**
     * @definition
     * A country corresponding to the string,
     * in the Matroska countries form; see (#country-codes) on country codes.
     * This element **MUST** be ignored if a `ChapLanguageBCP47` element is used within the same `ChapterDisplay` element.
     *
     * @id 0x437E
     */
    export type ChapCountry = string;

    /**
     * @definition
     * Contains all the commands associated with the Atom.
     *
     * @id 0x6944
     */
    export interface ChapProcess {
        ChapProcessCodecID: ChapProcessCodecID;
        ChapProcessPrivate?: ChapProcessPrivate;
        ChapProcessCommand?: ChapProcessCommand[];
    }

    /**
     * @definition
     * Contains the type of the codec used for processing.
     *
     * @default 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x6955
     */
    export enum ChapProcessCodecID {
        /**
         * @definition
         * Chapter commands using the Matroska Script codec.
         *
         */
        MatroskaScript = 0,
        /**
         * @definition
         * Chapter commands using the DVD-like codec.
         *
         */
        DvdMenu = 1
    }

    /**
     * @definition
     * Optional data attached to the `ChapProcessCodecID` information.
     *     For `ChapProcessCodecID` = 1, it is the "DVD level" equivalent; see (#menu-features) on DVD menus.
     *
     * @maxOccurs 1
     * @id 0x450D
     */
    export type ChapProcessPrivate = ArrayBuffer;

    /**
     * @definition
     * Contains all the commands associated with the Atom.
     *
     * @id 0x6911
     */
    export interface ChapProcessCommand {
        ChapProcessTime: ChapProcessTime;
        ChapProcessData: ChapProcessData;
    }

    /**
     * @definition
     * Defines when the process command **SHOULD** be handled.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x6922
     */
    export enum ChapProcessTime {
        /**
         */
        DuringTheWholeChapter = 0,
        /**
         */
        BeforeStartingPlayback = 1,
        /**
         */
        AfterPlaybackOfTheChapter = 2
    }

    /**
     * @definition
     * Contains the command information.
     * The data **SHOULD** be interpreted depending on the `ChapProcessCodecID` value. For `ChapProcessCodecID` = 1,
     * the data correspond to the binary DVD cell pre/post commands; see (#menu-features) on DVD menus.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x6933
     */
    export type ChapProcessData = ArrayBuffer;

    /**
     * @definition
     * Element containing metadata describing `Tracks`, `Editions`, `Chapters`, `Attachments`, or the `Segment` as a whole.
     * A list of valid tags can be found in [@?I-D.ietf-cellar-tags].
     *
     * @id 0x1254C367
     */
    export interface Tags {
        Tag: Tag[];
    }

    /**
     * @definition
     * A single metadata descriptor.
     *
     * @minOccurs 1
     * @id 0x7373
     */
    export interface Tag {
        Targets: Targets;
        SimpleTag: SimpleTag[];
    }

    /**
     * @definition
     * Specifies which other elements the metadata represented by the tag value applies to.
     * If empty or omitted, then the tag value describes everything in the `Segment`.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x63C0
     */
    export interface Targets {
        TargetTypeValue: TargetTypeValue;
        TargetType?: TargetType;
        TagTrackUID?: TagTrackUID[];
        TagEditionUID?: TagEditionUID[];
        TagChapterUID?: TagChapterUID[];
        TagAttachmentUID?: TagAttachmentUID[];
    }

    /**
     * @definition
     * A number to indicate the logical level of the target.
     *
     * @usage notes
     * The `TargetTypeValue` values are meant to be compared.
     *     Higher values **MUST** correspond to a logical level that contains the lower logical level `TargetTypeValue` values.
     *
     * @default 50
     * @range not 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x68CA
     */
    export enum TargetTypeValue {
        /**
         * @definition
         * The lowest hierarchy found in music or movies.
         *
         */
        Shot = 10,
        /**
         * @definition
         * Corresponds to parts of a track for audio, such as a movement or scene in a movie.
         *
         */
        SubtrackMovementScene = 20,
        /**
         * @definition
         * The common parts of an album or movie.
         *
         */
        TrackSongChapter = 30,
        /**
         * @definition
         * When an album or episode has different logical parts.
         *
         */
        PartSession = 40,
        /**
         * @definition
         * The most common grouping level of music and video (e.g., an episode for TV series).
         *
         */
        AlbumOperaConcertMovieEpisode = 50,
        /**
         * @definition
         * A list of lower levels grouped together.
         *
         */
        EditionIssueVolumeOpusSeasonSequel = 60,
        /**
         * @definition
         * The highest hierarchical level that tags can describe.
         *
         */
        Collection = 70
    }

    /**
     * @definition
     * An informational string that can be used to display the logical level of the target, such as "ALBUM", "TRACK", "MOVIE", "CHAPTER", etc.
     *
     * @maxOccurs 1
     * @id 0x63CA
     */
    export enum TargetType {
        /**
         */
        COLLECTION = 'COLLECTION',
        /**
         */
        EDITION = 'EDITION',
        /**
         */
        ISSUE = 'ISSUE',
        /**
         */
        VOLUME = 'VOLUME',
        /**
         */
        OPUS = 'OPUS',
        /**
         */
        SEASON = 'SEASON',
        /**
         */
        SEQUEL = 'SEQUEL',
        /**
         */
        ALBUM = 'ALBUM',
        /**
         */
        OPERA = 'OPERA',
        /**
         */
        CONCERT = 'CONCERT',
        /**
         */
        MOVIE = 'MOVIE',
        /**
         */
        EPISODE = 'EPISODE',
        /**
         */
        PART = 'PART',
        /**
         */
        SESSION = 'SESSION',
        /**
         */
        TRACK = 'TRACK',
        /**
         */
        SONG = 'SONG',
        /**
         */
        CHAPTER = 'CHAPTER',
        /**
         */
        SUBTRACK = 'SUBTRACK',
        /**
         */
        MOVEMENT = 'MOVEMENT',
        /**
         */
        SCENE = 'SCENE',
        /**
         */
        SHOT = 'SHOT'
    }

    /**
     * @definition
     * A UID that identifies the `Track(s)` that the tags belong to.
     *
     * @usage notes
     * If the value is 0 at this level, the tags apply to all tracks in the `Segment`.
     * If set to any other value, it **MUST** match the `TrackUID` value of a track found in this `Segment`.
     *
     * @default 0
     * @id 0x63C5
     */
    export type TagTrackUID = number;

    /**
     * @definition
     * A UID that identifies the `EditionEntry(s)` that the tags belong to.
     *
     * @usage notes
     * If the value is 0 at this level, the tags apply to all editions in the `Segment`.
     * If set to any other value, it **MUST** match the `EditionUID` value of an edition found in this `Segment`.
     *
     * @default 0
     * @id 0x63C9
     */
    export type TagEditionUID = number;

    /**
     * @definition
     * A UID that identifies the `Chapter(s)` that the tags belong to.
     *
     * @usage notes
     * If the value is 0 at this level, the tags apply to all chapters in the `Segment`.
     * If set to any other value, it **MUST** match the `ChapterUID` value of a chapter found in this `Segment`.
     *
     * @default 0
     * @id 0x63C4
     */
    export type TagChapterUID = number;

    /**
     * @definition
     * A UID that identifies the Attachment(s) that the tags belong to.
     *
     * @usage notes
     * If the value is 0 at this level, the tags apply to all the attachments in the `Segment`.
     * If set to any other value, it **MUST** match the `FileUID` value of an attachment found in this `Segment`.
     *
     * @default 0
     * @id 0x63C6
     */
    export type TagAttachmentUID = number;

    /**
     * @definition
     * Contains general information about the target.
     *
     * @minOccurs 1
     * @id 0x67C8
     */
    export interface SimpleTag {
        TagName: TagName;
        TagLanguage: TagLanguage;
        TagLanguageBCP47?: TagLanguageBCP47;
        TagDefault: TagDefault;
        TagDefaultBogus?: TagDefaultBogus;
        TagString?: TagString;
        TagBinary?: TagBinary;
    }

    /**
     * @definition
     * The name of the tag value that is going to be stored.
     *
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x45A3
     */
    export type TagName = string;

    /**
     * @definition
     * Specifies the language of the specified tag
     * in the Matroska languages form; see (#language-codes) on language codes.
     * This element **MUST** be ignored if the `TagLanguageBCP47` element is used within the same `SimpleTag` element.
     *
     * @default und
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x447A
     */
    export type TagLanguage = string;

    /**
     * @definition
     * The language used in the `TagString`,
     * in the form defined in [@!RFC5646]; see (#language-codes) on language codes.
     * If this element is used, then any `TagLanguage` elements used in the same `SimpleTag` **MUST** be ignored.
     *
     * @minver 4
     * @maxOccurs 1
     * @id 0x447B
     */
    export type TagLanguageBCP47 = string;

    /**
     * @definition
     * A boolean value to indicate if this is the default/original language to use for the given tag.
     *
     * @default 1
     * @range 0-1
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x4484
     */
    export type TagDefault = number;

    /**
     * @definition
     * A variant of the `TagDefault` element with a bogus element ID; see (#tagdefault-element).
     *
     * @default 1
     * @range 0-1
     * @minver 0
     * @maxver 0
     * @maxOccurs 1
     * @minOccurs 1
     * @id 0x44B4
     */
    export type TagDefaultBogus = number;

    /**
     * @definition
     * The tag value.
     *
     * @maxOccurs 1
     * @id 0x4487
     */
    export type TagString = string;

    /**
     * @definition
     * The tag value if it is binary. Note that this cannot be used in the same `SimpleTag` as `TagString`.
     *
     * @maxOccurs 1
     * @id 0x4485
     */
    export type TagBinary = ArrayBuffer;
}
