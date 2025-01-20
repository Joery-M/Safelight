/* eslint-disable @typescript-eslint/no-unused-vars */
// This file is to figure out how to extract the codec private data from AVC

// Main source: mkvtoolnix
// https://gitlab.com/mbunkus/mkvtoolnix/-/blob/main/src/common/avc/avcc.cpp?ref_type=heads#L149

function unpack(buffer: DataView) {
    if (buffer.byteLength <= 6) return;

    // Skip first, always 1
    let offset = 1;

    const readList = (entries_mask: number) => {
        const list: number[] = [];
        let numEntries = buffer.getUint8(offset++) & entries_mask;
        console.log('Entries', numEntries);

        while (numEntries) {
            console.log('Cur offset', offset);
            const size = buffer.getUint16(offset++, false);
            console.log(size);
            for (let i = 0; i < size; i++) {
                list.push(buffer.getInt8(offset + i));
            }
            numEntries--;
        }

        console.log('Last offset', offset);
        return list;
    };

    console.log(offset);
    const profile_idc = buffer.getUint8(offset++);
    console.log(offset);
    const profile_compat = buffer.getUint8(offset++);
    const level_idc = buffer.getUint8(offset++);
    const nalu_size_length = (buffer.getUint8(offset++) & 0x03) + 1;

    // const sps_list = readList(0x0f);
    // const pps_list = readList(0xff);
    const profile_string =
        profile_idc == 44
            ? 'CAVLC 4:4:4 Intra'
            : profile_idc == 66
              ? 'Baseline'
              : profile_idc == 77
                ? 'Main'
                : profile_idc == 83
                  ? 'Scalable Baseline'
                  : profile_idc == 86
                    ? 'Scalable High'
                    : profile_idc == 88
                      ? 'Extended'
                      : profile_idc == 100
                        ? 'High'
                        : profile_idc == 110
                          ? 'High 10'
                          : profile_idc == 118
                            ? 'Multiview High'
                            : profile_idc == 122
                              ? 'High 4:2:2'
                              : profile_idc == 128
                                ? 'Stereo High'
                                : profile_idc == 144
                                  ? 'High 4:4:4'
                                  : profile_idc == 244
                                    ? 'High 4:4:4 Predictive'
                                    : 'Unknown';

    console.log('Profile:', profile_idc, profile_string);
    console.log('Profile compat:', profile_compat);
    console.log('Level:', (level_idc / 10).toFixed(1));
    console.log('Nalu length:', nalu_size_length);

    console.log('====');
    console.log(
        'Codec string:',
        `avc1.${profile_idc.toString(16).padStart(2, '0')}${profile_compat
            .toString(16)
            .padStart(2, '0')}${level_idc.toString(16).padStart(2, '0')}`
    );
}

const data = new Uint8Array([
    0x01, 0x4d, 0x40, 0x32, 0xff, 0xe1, 0x00, 0x26, 0x67, 0x4d, 0x40, 0x32, 0x96, 0x52, 0x80, 0x50,
    0x01, 0x6b, 0x60, 0x2d, 0x40, 0x40, 0x40, 0x50, 0x00, 0x00, 0x3e, 0x80, 0x00, 0x0e, 0xa6, 0x0e,
    0x00, 0x00, 0x03, 0x01, 0x6e, 0x36, 0x00, 0x00, 0x7a, 0x12, 0x0b, 0xbc, 0xb8, 0x28, 0x01, 0x00,
    0x04, 0x68, 0xee, 0x3c, 0x80
]);

const view = new DataView(data.buffer);

unpack(view);
