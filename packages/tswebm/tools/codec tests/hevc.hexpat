import type.byte;

bitfield BitSet1 {
    general_profile_space: 2;
    general_tier_flag: 1;
    general_profile_idc: 5;
} [[format("type::impl::format_bits"), bitfield_order(std::core::BitfieldOrder::LeastToMostSignificant, 8)]];

bitfield BitSet2 {
    general_progressive_source_flag: 1;
    general_interlace_source_flag: 1;
    general_nonpacked_constraint_flag: 1;
    general_frame_only_constraint_flag: 1;
    reserved: 44 [[hidden]];
} [[format("type::impl::format_bits"), bitfield_order(std::core::BitfieldOrder::LeastToMostSignificant, 48)]];

bitfield BitSet4 {
    reserved: 4 [[hidden]];
    min_spatial_segmentation_idc: 12;
    reserved1: 6 [[hidden]];
    parallelism_type: 2;
    reserved2: 6 [[hidden]];
    chroma_format_idc: 2;
    reserved3: 5 [[hidden]];
    bit_depth_luma_minus8: 3;
    reserved4: 5 [[hidden]];
    bit_depth_chroma_minus8: 3;
} [[format("type::impl::format_bits"), bitfield_order(std::core::BitfieldOrder::LeastToMostSignificant, 48)]];

bitfield BitSet5 {
    reserved: 2 [[hidden]];
    max_sub_layers: 3;
    temporal_id_nesting_flag: 1;
    size_nalu_minus_one: 2;
} [[format("type::impl::format_bits"), bitfield_order(std::core::BitfieldOrder::LeastToMostSignificant, 8)]];

bitfield BitSetParams {
    array_completeness: 1;
    reserved: 1 [[hidden]];
    nal_unit_type: 6;
} [[format("type::impl::format_bits"), bitfield_order(std::core::BitfieldOrder::LeastToMostSignificant, 8)]];

struct NalUnit {
    be u16 size;
    u8 data[size];
};

struct ParameterSet {
    BitSetParams bitSet [[inline]];
    be u16 nal_unit_count;
    NalUnit units[nal_unit_count] [[inline]];
};

struct HEVCHeader {
    u8 configurationVersion;
    BitSet1 bitSet1 [[inline]];
    u32 general_profile_compatibility_flag;
    BitSet2 bitSet2 [[inline]];
    u8 general_level_idc;
    BitSet4 bitSet4 [[inline]];
    $ += 2;
    BitSet5 bitSet5 [[inline]];
    u8 num_parameter_sets;
    
    ParameterSet sets[num_parameter_sets] [[inline]];
};