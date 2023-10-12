/** @odoo-module */

import { SocialPostFormatterMixin } from '@social/js/social_post_formatter_mixin';

import { patch } from '@web/core/utils/patch';

QUnit.module('Social Formatter Regex', {}, () => {
    QUnit.test('Facebook Message', (assert) => {
        assert.expect(1);

        patch(SocialPostFormatterMixin, "test_formatted_mixin_facebook", {
            _getMediaType() { return 'facebook' },
            _formatPost() {
                this.originalPost = { account_id: { raw_value: 42 } };
                return this._super(...arguments);
            }
        });

        const testMessage = 'Hello @[542132] Odoo-Social, check this out: https://www.odoo.com?utm=mail&param=1 #crazydeals #odoo';
        const finalMessage = SocialPostFormatterMixin._formatPost(testMessage);

        assert.equal(finalMessage, [
            "Hello",
            "<a href='/social_facebook/redirect_to_profile/42/542132?name=Odoo-Social' target='_blank'>Odoo-Social</a>,",
            "check this out:",
            "<a href='https://www.odoo.com?utm=mail&amp;param=1' target='_blank' rel='noreferrer noopener'>https://www.odoo.com?utm=mail&amp;param=1</a>",
            "<a href='https://www.facebook.com/hashtag/crazydeals' target='_blank'>#crazydeals</a>",
            "<a href='https://www.facebook.com/hashtag/odoo' target='_blank'>#odoo</a>",
        ].join(' '));
    });

    QUnit.test('Instagram Message', (assert) => {
        assert.expect(1);

        patch(SocialPostFormatterMixin, "test_formatted_mixin_instagram", {
            _getMediaType() { return 'instagram' },
        });

        const testMessage = 'Hello @Odoo.Social, check this out: https://www.odoo.com #crazydeals #odoo';
        const finalMessage = SocialPostFormatterMixin._formatPost(testMessage);

        assert.equal(finalMessage, [
            "Hello",
            "<a href='https://www.instagram.com/Odoo.Social' target='_blank'>@Odoo.Social</a>,",
            "check this out:",
            "<a href='https://www.odoo.com' target='_blank' rel='noreferrer noopener'>https://www.odoo.com</a>",
            "<a href='https://www.instagram.com/explore/tags/crazydeals' target='_blank'>#crazydeals</a>",
            "<a href='https://www.instagram.com/explore/tags/odoo' target='_blank'>#odoo</a>",
        ].join(' '));
    });

    QUnit.test('LinkedIn Message', (assert) => {
        assert.expect(1);

        patch(SocialPostFormatterMixin, "test_formatted_mixin_linkedin", {
            _getMediaType() { return 'linkedin' },
        });

        const testMessage = 'Hello, check this out: https://www.odoo.com {hashtag|#|crazydeals} #odoo';
        const finalMessage = SocialPostFormatterMixin._formatPost(testMessage);

        assert.equal(finalMessage, [
            "Hello, check this out:",
            "<a href='https://www.odoo.com' target='_blank' rel='noreferrer noopener'>https://www.odoo.com</a>",
            "<a href='https://www.linkedin.com/feed/hashtag/crazydeals' target='_blank'>#crazydeals</a>",
            "<a href='https://www.linkedin.com/feed/hashtag/odoo' target='_blank'>#odoo</a>",
        ].join(' '));
    });

    QUnit.test('Twitter Message', (assert) => {
        assert.expect(1);

        patch(SocialPostFormatterMixin, "test_formatted_mixin_twitter", {
            _getMediaType() { return 'twitter' },
        });

        const testMessage = 'Hello @Odoo-Social, check this out: https://www.odoo.com #crazydeals #odoo';
        const finalMessage = SocialPostFormatterMixin._formatPost(testMessage);

        assert.equal(finalMessage, [
            "Hello",
            "<a href='https://twitter.com/Odoo-Social' target='_blank'>@Odoo-Social</a>,",
            "check this out:",
            "<a href='https://www.odoo.com' target='_blank' rel='noreferrer noopener'>https://www.odoo.com</a>",
            "<a href='https://twitter.com/hashtag/crazydeals?src=hash' target='_blank'>#crazydeals</a>",
            "<a href='https://twitter.com/hashtag/odoo?src=hash' target='_blank'>#odoo</a>",
        ].join(' '));
    });

    QUnit.test('YouTube Message', (assert) => {
        assert.expect(1);

        patch(SocialPostFormatterMixin, "test_formatted_mixin_youtube", {
            _getMediaType() { return 'youtube' },
        });

        const testMessage = 'Hello, check this out: https://www.odoo.com #crazydeals #odoo';
        const finalMessage = SocialPostFormatterMixin._formatPost(testMessage);

        assert.equal(finalMessage, [
            "Hello, check this out:",
            "<a href='https://www.odoo.com' target='_blank' rel='noreferrer noopener'>https://www.odoo.com</a>",
            "<a href='https://www.youtube.com/results?search_query=%23crazydeals' target='_blank'>#crazydeals</a>",
            "<a href='https://www.youtube.com/results?search_query=%23odoo' target='_blank'>#odoo</a>",
        ].join(' '));
    });
});
