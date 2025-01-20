// This file is to figure out how to extract the codec private data from HEVC

// Main source: mp4box.js
// https://github.com/gpac/mp4box.js/blob/2c15bfd58c095776e6ce1a02dd974d77b51c2129/src/parsing/hvcC.js

function unpack(stream: DataView) {
    let offset = 0;

    const configuration_version = stream.getUint8(offset++);

    let tempByte = stream.getUint8(offset++);
    const general_profile_space = tempByte >> 6;
    const general_tier_flag = (tempByte & 0x20) >> 5;
    const general_profile_idc = tempByte & 0x1f;

    const general_profile_compatibility_flag = stream.getUint32(offset);
    offset += 4;

    const general_constraint_indicator = new Uint8Array(stream.buffer.slice(offset, offset + 6));
    offset += 6;

    const general_level_idc = stream.getUint8(offset++);

    const min_spatial_segmentation_idc = stream.getUint16(offset) & 0xfff;
    offset += 2;

    const parallelism_type = stream.getUint8(offset++) & 0x3;
    const chroma_format_idc = stream.getUint8(offset++) & 0x3;
    const bit_depth_luma_minus8 = stream.getUint8(offset++) & 0x7;
    const bit_depth_chroma_minus8 = stream.getUint8(offset++) & 0x7;
    const avg_frame_rate = stream.getUint16(offset);
    offset += 2;

    tempByte = stream.getUint8(offset++);
    const constant_frame_rate = tempByte >> 6;
    const num_temporal_layers = (tempByte & 0xd) >> 3;
    const temporal_id_nested = (tempByte & 0x4) >> 2;
    const length_size_minus_one = tempByte & 0x3;

    let num_arrays = stream.getUint8(offset++);

    const vps_list: number[] = [];
    const sps_list: number[] = [];
    const pps_list: number[] = [];
    const sei_list: number[] = [];

    while (num_arrays > 0) {
        const type = stream.getUint8(offset++) & 0x3f;
        let nal_unit_count = stream.getUint16(offset, false);
        offset += 2;

        const curList =
            type == 32 ? vps_list : type == 33 ? sps_list : type == 34 ? pps_list : sei_list;

        try {
            while (nal_unit_count) {
                const size = stream.getUint16(offset, false);
                offset += 2;
                offset += size;
                curList.push(...new Uint8Array(stream.buffer.slice(offset, offset + size)));
                nal_unit_count--;
            }
        } catch (error) {
            console.error(error);
        }

        num_arrays--;
    }

    return {
        configuration_version,
        general_profile_space,
        general_tier_flag,
        general_profile_idc,
        general_profile_compatibility_flag,
        general_constraint_indicator,
        general_level_idc,
        min_spatial_segmentation_idc,
        parallelism_type,
        chroma_format_idc,
        bit_depth_luma_minus8,
        bit_depth_chroma_minus8,
        avg_frame_rate,
        constant_frame_rate,
        num_temporal_layers,
        temporal_id_nested,
        length_size_minus_one,
        vps_list,
        sps_list,
        pps_list,
        sei_list
    };
}

// https://github.com/gpac/mp4box.js/blob/fbc03484283e389eae011c99a7a21a09a5c45f40/src/box-codecs.js#L106
function formatCodecData(data: ReturnType<typeof unpack>) {
    let baseCodec = 'hev1.';
    switch (data.general_profile_space) {
        case 0:
            baseCodec += '';
            break;
        case 1:
            baseCodec += 'A';
            break;
        case 2:
            baseCodec += 'B';
            break;
        case 3:
            baseCodec += 'C';
            break;
    }
    baseCodec += data.general_profile_idc + '.';

    let val = data.general_profile_compatibility_flag;
    let reversed = 0;
    for (let i = 0; i < 32; i++) {
        reversed |= val & 1;
        if (i == 31) break;
        reversed <<= 1;
        val >>= 1;
    }

    baseCodec += decimalToHex(reversed) + '.';

    if (data.general_tier_flag === 0) {
        baseCodec += 'L';
    } else {
        baseCodec += 'H';
    }

    baseCodec += data.general_level_idc;

    let hasByte = false;
    let constraintString = '';

    for (let i = 5; i >= 0; i--) {
        if (data.general_constraint_indicator[i] || hasByte) {
            constraintString =
                '.' + decimalToHex(data.general_constraint_indicator[i], 0) + constraintString;
            hasByte = true;
        }
    }

    baseCodec += constraintString;

    return baseCodec;
}

function decimalToHex(d: number, padding?: number) {
    let hex = Number(d).toString(16);
    padding = typeof padding === 'undefined' || padding === null ? (padding = 2) : padding;
    while (hex.length < padding) {
        hex = '0' + hex;
    }
    return hex;
}

// hev1.1.2.L150.90
// const data = new Uint8Array([
//     0x01, 0x01, 0x40, 0x00, 0x00, 0x00, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00, 0x96, 0xf0, 0x00, 0xfc,
//     0xfd, 0xf8, 0xf8, 0x00, 0x00, 0x0f, 0x03, 0x20, 0x00, 0x01, 0x00, 0x17, 0x40, 0x01, 0x0c, 0x01,
//     0xff, 0xff, 0x01, 0x40, 0x00, 0x00, 0x03, 0x00, 0x90, 0x00, 0x00, 0x03, 0x00, 0x00, 0x03, 0x00,
//     0x96, 0xac, 0x09, 0x21, 0x00, 0x01, 0x00, 0x3d, 0x42, 0x01, 0x01, 0x01, 0x40, 0x00, 0x00, 0x03,
//     0x00, 0x90, 0x00, 0x00, 0x03, 0x00, 0x00, 0x03, 0x00, 0x96, 0xa0, 0x01, 0x40, 0x20, 0x05, 0xa1,
//     0x65, 0xad, 0x29, 0x09, 0x64, 0xb8, 0xc0, 0x5a, 0x80, 0x80, 0x80, 0x82, 0x00, 0x00, 0x03, 0x00,
//     0x02, 0x00, 0x00, 0x03, 0x00, 0x3c, 0xc0, 0x0b, 0xbc, 0xa2, 0x00, 0x00, 0x4c, 0x4b, 0x40, 0x00,
//     0x00, 0xbe, 0xbc, 0x20, 0x80, 0x22, 0x00, 0x01, 0x00, 0x07, 0x44, 0x01, 0xc0, 0xf7, 0xc0, 0xcc,
//     0x90
// ]);

// hev1.4.10.L123.98.8
const data = new Uint8Array([
    0x01, 0x04, 0x08, 0x00, 0x00, 0x00, 0x98, 0x08, 0x00, 0x00, 0x00, 0x00, 0x7b, 0xf0, 0x00, 0xfc,
    0xff, 0xfc, 0xfc, 0x00, 0x00, 0x0f, 0x04, 0x20, 0x00, 0x01, 0x00, 0x17, 0x40, 0x01, 0x0c, 0x01,
    0xff, 0xff, 0x04, 0x08, 0x00, 0x00, 0x03, 0x00, 0x98, 0x08, 0x00, 0x00, 0x03, 0x00, 0x00, 0x7b,
    0x95, 0x98, 0x09, 0x21, 0x00, 0x01, 0x00, 0x2d, 0x42, 0x01, 0x01, 0x04, 0x08, 0x00, 0x00, 0x03,
    0x00, 0x98, 0x08, 0x00, 0x00, 0x03, 0x00, 0x00, 0x7b, 0x90, 0x00, 0x78, 0x10, 0x02, 0x1c, 0x8a,
    0x52, 0xca, 0xcd, 0x24, 0x99, 0x5e, 0x02, 0xd4, 0x24, 0x40, 0x24, 0x10, 0x00, 0x00, 0x0f, 0xb0,
    0x00, 0x03, 0xac, 0x50, 0x80, 0x22, 0x00, 0x01, 0x00, 0x08, 0x44, 0x01, 0xc1, 0x72, 0x86, 0x0c,
    0x46, 0x24, 0x27, 0x00, 0x02, 0x00, 0x09, 0x4e, 0x01, 0x90, 0x04, 0x04, 0x4c, 0x00, 0xb4, 0x80,
    0x00, 0x1e, 0x4e, 0x01, 0x89, 0x18, 0x21, 0x34, 0x9b, 0xaa, 0x19, 0x96, 0x08, 0xfc, 0x8a, 0x48,
    0x39, 0x08, 0x3d, 0x13, 0x3d, 0x13, 0x00, 0x98, 0x96, 0x80, 0x00, 0x00, 0x03, 0x00, 0x01, 0x80
]);

const bitView = new DataView(data.buffer);

console.log(formatCodecData(unpack(bitView)));
